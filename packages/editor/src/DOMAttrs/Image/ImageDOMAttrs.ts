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
} from "../_Utilities";
import type {
	CreateImageAttrValidatorsParams,
	CreateImageAttrValidatorsResult,
} from "./ImageDOMAttrs-types";

const maxSrcLength = 2048;

// A "data:image/*" src holds the whole image
const maxDataImageSrcLength = 5 * 1024 * 1024;

const maxAltLength = 1000;

// The block resize's minimum width
const minBlockWidth = 300;

const maxBlockWidth = 10000;

const blockWidthPattern = /^[1-9]\d*$/;

const allowedObjectFits = new Set<string>(Object.values(objectFitAttr.value));

const allowedAspectRatios = new Set<string>(
	Object.values(aspectRatioAttr.value),
);

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
 * A block width is valid if it's a whole number of px, without its unit, between 300 and 10000.
 */
const validateBlockWidth: ValidateAttrFn<string | null> = ({ value }) => {
	if (!blockWidthPattern.test(value)) {
		return {
			kind: "fallback",
			reason: "must be a whole number of px, without its unit",
			value: null,
		};
	}

	const blockWidth = Number(value);

	if (blockWidth < minBlockWidth || blockWidth > maxBlockWidth) {
		return {
			kind: "fallback",
			reason: `must be between ${minBlockWidth} and ${maxBlockWidth}`,
			value: null,
		};
	}

	return null;
};

/*
 * A src is valid if it isn't empty, and it's at most 2048 characters long (5 MiB for a "data:image/*" one). Whether it's
 * a safe URL is the Sanitizer's job. An invalid one is rejected: an image has no src to fall back to.
 */
const validateSrc: ValidateAttrFn<string> = ({ value }) => {
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
	if (value.length > maxAltLength) {
		return {
			kind: "fallback",
			reason: `must be at most ${maxAltLength} characters long`,
			value: null,
		};
	}

	return null;
};

const validateObjectFit: ValidateAttrFn<string | null> = ({ value }) => {
	if (!allowedObjectFits.has(value)) {
		return {
			kind: "fallback",
			reason: `must be ${[...allowedObjectFits].join(", ")}`,
			value: null,
		};
	}

	return null;
};

const validateAspectRatio: ValidateAttrFn<string | null> = ({ value }) => {
	if (!allowedAspectRatios.has(value)) {
		return {
			kind: "fallback",
			reason: `must be ${[...allowedAspectRatios].join(", ")}`,
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
