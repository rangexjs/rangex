import {
	blockComponentLineRole,
	blockComponentRole,
	htmlLayoutRole,
	xhtmlNamespaceURI,
} from "@rangex/core";
import { blockAlignAttr, blockWidthAttr } from "#constants";
import {
	type ComponentAttrsShape,
	createComponentAttrValidators,
	type ElementAttrsShape,
	type ElementDescriptor,
	type ValidateAttrFn,
	validateBlockAlign,
	validateBlockWidth,
	validateBooleanAttr,
	validateMediaSrc,
	validateTitle,
} from "../_Utilities";
import type {
	CreateAudioAttrValidatorsParams,
	CreateAudioAttrValidatorsResult,
} from "./AudioDOMAttrs-types";

const lineAttrsShape = {
	[blockAlignAttr.name]: "required",
} as const satisfies ElementAttrsShape;

const blockAttrsShape = {
	[blockWidthAttr.name]: "optional",
} as const satisfies ElementAttrsShape;

const audioElementAttrsShape = {
	src: "required",
	controls: "required",
	autoplay: "optional",
	loop: "optional",
	muted: "optional",
	title: "optional",
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

const audioElement: ElementDescriptor = {
	localName: "audio",
	namespaceURI: xhtmlNamespaceURI,
	editorRole: htmlLayoutRole,
};

export const audioAttrsShape = {
	line: lineAttrsShape,
	block: blockAttrsShape,
	audio: audioElementAttrsShape,
} as const satisfies ComponentAttrsShape;

const validateControls: ValidateAttrFn<string> = ({ value }) => {
	if (value !== "") {
		return { kind: "fallback", reason: "must be empty", value: "" };
	}

	return null;
};

/*
 * Creates the Audio's attribute validators: the defaults, replaced by the given ones of the same attributes (see
 * createComponentAttrValidators).
 */
export const createAudioAttrValidators = (
	validatorOverrides: CreateAudioAttrValidatorsParams,
): CreateAudioAttrValidatorsResult => {
	const audioAttrValidators = createComponentAttrValidators({
		componentAttrsShape: audioAttrsShape,
		elementDescriptors: {
			line: lineElement,
			block: blockElement,
			audio: audioElement,
		},
		defaultValidators: {
			line: {
				[blockAlignAttr.name]: validateBlockAlign,
			},
			block: {
				[blockWidthAttr.name]: validateBlockWidth,
			},
			audio: {
				src: validateMediaSrc,
				controls: validateControls,
				autoplay: validateBooleanAttr,
				loop: validateBooleanAttr,
				muted: validateBooleanAttr,
				title: validateTitle,
			},
		},
		validatorOverrides,
	});

	return audioAttrValidators;
};
