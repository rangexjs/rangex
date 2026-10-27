import {
	blockComponentLineRole,
	blockComponentRole,
	htmlLayoutRole,
	xhtmlNamespaceURI,
} from "@rangex/core";
import { aspectRatioAttr, blockAlignAttr, blockWidthAttr } from "#constants";
import {
	type ComponentAttrsShape,
	createComponentAttrValidators,
	type ElementAttrsShape,
	type ElementDescriptor,
	type ValidateAttrFn,
	validateAspectRatio,
	validateBlockAlign,
	validateBlockWidth,
	validateMediaSrc,
	validateTitle,
} from "../_Utilities";
import type {
	CreateEmbedAttrValidatorsParams,
	CreateEmbedAttrValidatorsResult,
} from "./EmbedDOMAttrs-types";

export const embedSandbox =
	"allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation";

export const embedAllow =
	"fullscreen; autoplay; encrypted-media; picture-in-picture; clipboard-write";

export const embedLoading = "lazy";

const lineAttrsShape = {
	[blockAlignAttr.name]: "required",
} as const satisfies ElementAttrsShape;

const blockAttrsShape = {
	[blockWidthAttr.name]: "optional",
} as const satisfies ElementAttrsShape;

const iframeAttrsShape = {
	src: "required",
	title: "optional",
	sandbox: "required",
	allow: "required",
	loading: "required",
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

const iframeElement: ElementDescriptor = {
	localName: "iframe",
	namespaceURI: xhtmlNamespaceURI,
	editorRole: htmlLayoutRole,
};

export const embedAttrsShape = {
	line: lineAttrsShape,
	block: blockAttrsShape,
	iframe: iframeAttrsShape,
} as const satisfies ComponentAttrsShape;

/*
 * Creates a validator of an attribute every Embed is created with the same value of (e.g. its sandbox): any other value
 * falls back to it.
 */
const createFixedValueValidator = (
	fixedValue: string,
): ValidateAttrFn<string> => {
	return ({ value }) => {
		if (value !== fixedValue) {
			return {
				kind: "fallback",
				reason: "must be the value every Embed is created with",
				value: fixedValue,
			};
		}

		return null;
	};
};

/*
 * Creates the Embed's attribute validators: the defaults, replaced by the given ones of the same attributes (see
 * createComponentAttrValidators).
 */
export const createEmbedAttrValidators = (
	validatorOverrides: CreateEmbedAttrValidatorsParams,
): CreateEmbedAttrValidatorsResult => {
	const embedAttrValidators = createComponentAttrValidators({
		componentAttrsShape: embedAttrsShape,
		elementDescriptors: {
			line: lineElement,
			block: blockElement,
			iframe: iframeElement,
		},
		defaultValidators: {
			line: {
				[blockAlignAttr.name]: validateBlockAlign,
			},
			block: {
				[blockWidthAttr.name]: validateBlockWidth,
			},
			iframe: {
				src: validateMediaSrc,
				title: validateTitle,
				sandbox: createFixedValueValidator(embedSandbox),
				allow: createFixedValueValidator(embedAllow),
				loading: createFixedValueValidator(embedLoading),
				[aspectRatioAttr.name]: validateAspectRatio,
			},
		},
		validatorOverrides,
	});

	return embedAttrValidators;
};
