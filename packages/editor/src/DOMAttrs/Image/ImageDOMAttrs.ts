import {
	blockComponentLineRole,
	blockComponentRole,
	htmlLayoutRole,
	xhtmlNamespaceURI,
} from "@rangex/core";

import { aspectRatioAttr, blockAlignAttr, blockWidthAttr, objectFitAttr } from "#constants";
import { isDataImageURL } from "#utilities";

import {
	type ComponentAttrsShape,
	createComponentAttrValidators,
	type ElementAttrsShape,
	type ElementDescriptor,
	type ValidateAttrFn,
	validateAspectRatio,
	validateBlockAlign,
	validateBlockWidth,
	validateObjectFit,
} from "../_Utilities";
import type {
	CreateImageAttrValidatorsParams,
	CreateImageAttrValidatorsResult,
} from "./ImageDOMAttrs-types";

const lineAttrsShape = {
	[blockAlignAttr.name]: "required",
} as const satisfies ElementAttrsShape;

const blockAttrsShape = {
	[blockWidthAttr.name]: "optional",
} as const satisfies ElementAttrsShape;

const imgAttrsShape = {
	src: "required",
	alt: "optional",
	"aria-hidden": "optional",
	[objectFitAttr.name]: "optional",
	[aspectRatioAttr.name]: "optional",
} as const satisfies ElementAttrsShape;

const lineElement: ElementDescriptor = {
	localName: "div",
	namespaceURI: xhtmlNamespaceURI,
	editorRole: blockComponentLineRole,
};

const blockElement: ElementDescriptor = {
	localName: "div",
	namespaceURI: xhtmlNamespaceURI,
	editorRole: blockComponentRole,
};

const imgElement: ElementDescriptor = {
	localName: "img",
	namespaceURI: xhtmlNamespaceURI,
	editorRole: htmlLayoutRole,
};

export const imageAttrsShape = {
	line: lineAttrsShape,
	block: blockAttrsShape,
	img: imgAttrsShape,
} as const satisfies ComponentAttrsShape;

/*
 * A src is valid if it isn't empty, it isn't a "data:image/*" URL (it would store the whole image in the snapshot), and
 * it's at most 4096 characters long. Whether it's a safe URL is the Sanitizer's job. An invalid one is rejected: an
 * image has no src to fall back to.
 */
const validateSrc: ValidateAttrFn<string> = ({ value }) => {
	const maxSrcLength = 4096;

	if (value.trim() === "") {
		return { kind: "reject", reason: "must not be empty" };
	}

	if (isDataImageURL(value)) {
		return { kind: "reject", reason: "must not be a data URL" };
	}

	if (value.length > maxSrcLength) {
		return {
			kind: "reject",
			reason: `must be at most ${maxSrcLength} characters long`,
		};
	}

	return null;
};

const validateAlt: ValidateAttrFn<string | null> = ({ value }) => {
	const maxAltLength = 1000;

	if (value.length > maxAltLength) {
		return {
			kind: "fallback",
			reason: `must be at most ${maxAltLength} characters long`,
			value: null,
		};
	}

	return null;
};

/*
 * Only "true" hides the image from screen readers: any other value falls back to none, as if it weren't set.
 */
const validateAriaHidden: ValidateAttrFn<string | null> = ({ value }) => {
	if (value !== "true") {
		return { kind: "fallback", reason: 'must be "true"', value: null };
	}

	return null;
};

/*
 * Creates the Image's attribute validators: the defaults, replaced by the given ones of the same attributes (see
 * createComponentAttrValidators).
 */
export const createImageAttrValidators = (
	validatorOverrides: CreateImageAttrValidatorsParams,
): CreateImageAttrValidatorsResult => {
	const imageAttrValidators = createComponentAttrValidators({
		componentAttrsShape: imageAttrsShape,
		elementDescriptors: {
			line: lineElement,
			block: blockElement,
			img: imgElement,
		},
		defaultValidators: {
			line: {
				[blockAlignAttr.name]: validateBlockAlign,
			},
			block: {
				[blockWidthAttr.name]: validateBlockWidth,
			},
			img: {
				src: validateSrc,
				alt: validateAlt,
				"aria-hidden": validateAriaHidden,
				[objectFitAttr.name]: validateObjectFit,
				[aspectRatioAttr.name]: validateAspectRatio,
			},
		},
		validatorOverrides,
	});

	return imageAttrValidators;
};
