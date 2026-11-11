import {
	blockComponentLineRole,
	blockComponentRole,
	htmlLayoutRole,
	xhtmlNamespaceURI,
} from "@rangex/core";

import { aspectRatioAttr, blockAlignAttr, blockWidthAttr, objectFitAttr } from "#constants";

import {
	type ComponentAttrsShape,
	createComponentAttrValidators,
	type ElementAttrsShape,
	type ElementDescriptor,
	type ValidateAttrFn,
	validateAspectRatio,
	validateBlockAlign,
	validateBlockWidth,
	validateBooleanAttr,
	validateMediaSrc,
	validateObjectFit,
	validateTitle,
} from "../_Utilities";
import type {
	CreateVideoAttrValidatorsParams,
	CreateVideoAttrValidatorsResult,
} from "./VideoDOMAttrs-types";

const lineAttrsShape = {
	[blockAlignAttr.name]: "required",
} as const satisfies ElementAttrsShape;

const blockAttrsShape = {
	[blockWidthAttr.name]: "optional",
} as const satisfies ElementAttrsShape;

const videoElementAttrsShape = {
	src: "required",
	controls: "optional",
	autoplay: "optional",
	loop: "optional",
	muted: "optional",
	poster: "optional",
	title: "optional",
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

const videoElement: ElementDescriptor = {
	localName: "video",
	namespaceURI: xhtmlNamespaceURI,
	editorRole: htmlLayoutRole,
};

export const videoAttrsShape = {
	line: lineAttrsShape,
	block: blockAttrsShape,
	video: videoElementAttrsShape,
} as const satisfies ComponentAttrsShape;

/*
 * A poster is valid if it isn't empty and it's at most 4096 characters long. Whether it's a safe URL is the
 * Sanitizer's job. An invalid one is removed, the video is shown without it.
 */
const validatePoster: ValidateAttrFn<string | null> = ({ value }) => {
	const maxPosterLength = 4096;

	if (value.trim() === "") {
		return { kind: "fallback", reason: "must not be empty", value: null };
	}

	if (value.length > maxPosterLength) {
		return {
			kind: "fallback",
			reason: `must be at most ${maxPosterLength} characters long`,
			value: null,
		};
	}

	return null;
};

/*
 * Creates the Video's attribute validators: the defaults, replaced by the given ones of the same attributes (see
 * createComponentAttrValidators).
 */
export const createVideoAttrValidators = (
	validatorOverrides: CreateVideoAttrValidatorsParams,
): CreateVideoAttrValidatorsResult => {
	const videoAttrValidators = createComponentAttrValidators({
		componentAttrsShape: videoAttrsShape,
		elementDescriptors: {
			line: lineElement,
			block: blockElement,
			video: videoElement,
		},
		defaultValidators: {
			line: {
				[blockAlignAttr.name]: validateBlockAlign,
			},
			block: {
				[blockWidthAttr.name]: validateBlockWidth,
			},
			video: {
				src: validateMediaSrc,
				controls: validateBooleanAttr,
				autoplay: validateBooleanAttr,
				loop: validateBooleanAttr,
				muted: validateBooleanAttr,
				poster: validatePoster,
				title: validateTitle,
				[objectFitAttr.name]: validateObjectFit,
				[aspectRatioAttr.name]: validateAspectRatio,
			},
		},
		validatorOverrides,
	});

	return videoAttrValidators;
};
