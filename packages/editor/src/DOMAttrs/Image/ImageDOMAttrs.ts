import {
	blockComponentRole,
	htmlLayoutRole,
	xhtmlNamespaceURI,
} from "@rangex/core";
import { isDataImageURL } from "#utilities";
// Not from "#engine-links": its other modules need a DOM, and the validation must run on a server
import {
	aspectRatioAttr,
	blockWidthAttr,
	objectFitAttr,
} from "../../EngineLinks/Constants/AttrNames";
import {
	type ComponentAttrsShape,
	createComponentAttrValidators,
	type ElementAttrsShape,
	type ElementDescriptor,
	type ValidateAttrFn,
	validateAspectRatio,
	validateBlockWidth,
	validateObjectFit,
} from "../_Utilities";
import type {
	CreateImageAttrValidatorsParams,
	CreateImageAttrValidatorsResult,
} from "./ImageDOMAttrs-types";

const blockAttrsShape = {
	[blockWidthAttr.name]: "optional",
} as const satisfies ElementAttrsShape;

const imgAttrsShape = {
	src: "required",
	alt: "optional",
	[objectFitAttr.name]: "optional",
	[aspectRatioAttr.name]: "optional",
} as const satisfies ElementAttrsShape;

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
	block: blockAttrsShape,
	img: imgAttrsShape,
} as const satisfies ComponentAttrsShape;

/*
 * A src is valid if it isn't empty, and it's at most 2048 characters long (5 MiB for a "data:image/*" one). Whether it's
 * a safe URL is the Sanitizer's job. An invalid one is rejected: an image has no src to fall back to.
 */
const validateSrc: ValidateAttrFn<string> = ({ value }) => {
	const maxSrcLength = 2048;
	// A "data:image/*" src holds the whole image
	const maxDataImageSrcLength = 5 * 1024 * 1024;

	if (value.trim() === "") {
		return { kind: "reject", reason: "must not be empty" };
	}

	const maxLength = isDataImageURL(value)
		? maxDataImageSrcLength
		: maxSrcLength;

	if (value.length > maxLength) {
		return {
			kind: "reject",
			reason: `must be at most ${maxLength} characters long`,
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
 * Creates the Image's attribute validators: the defaults, replaced by the given ones of the same attributes (see
 * createComponentAttrValidators).
 */
export const createImageAttrValidators = (
	validatorOverrides: CreateImageAttrValidatorsParams,
): CreateImageAttrValidatorsResult => {
	const imageAttrValidators = createComponentAttrValidators({
		componentAttrsShape: imageAttrsShape,
		elementDescriptors: { block: blockElement, img: imgElement },
		defaultValidators: {
			block: {
				[blockWidthAttr.name]: validateBlockWidth,
			},
			img: {
				src: validateSrc,
				alt: validateAlt,
				[objectFitAttr.name]: validateObjectFit,
				[aspectRatioAttr.name]: validateAspectRatio,
			},
		},
		validatorOverrides,
	});

	return imageAttrValidators;
};
