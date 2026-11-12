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
	validateTitle,
} from "../_Utilities";
import type {
	CreateEmbedAttrValidatorsParams,
	CreateEmbedAttrValidatorsResult,
} from "./EmbedDOMAttrs-types";

const lineAttrsShape = {
	[blockAlignAttr.name]: "required",
} as const satisfies ElementAttrsShape;

const blockAttrsShape = {
	[blockWidthAttr.name]: "optional",
} as const satisfies ElementAttrsShape;

const iframeAttrsShape = {
	src: "required",
	title: "optional",
	sandbox: "optional",
	allow: "optional",
	loading: "optional",
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
 * A sandbox is valid if it only lists known sandbox tokens, each once. An empty one is the strictest sandbox. An
 * invalid one is removed.
 */
const validateSandbox: ValidateAttrFn<string | null> = ({ value }) => {
	const sandboxTokens = new Set([
		"allow-downloads",
		"allow-forms",
		"allow-modals",
		"allow-orientation-lock",
		"allow-pointer-lock",
		"allow-popups",
		"allow-popups-to-escape-sandbox",
		"allow-presentation",
		"allow-same-origin",
		"allow-scripts",
		"allow-storage-access-by-user-activation",
		"allow-top-navigation",
		"allow-top-navigation-by-user-activation",
		"allow-top-navigation-to-custom-protocols",
	]);

	const tokens = value.split(/\s+/);
	const nonEmptyTokens = tokens.filter((token) => token !== "");
	const uniqueTokens = new Set(nonEmptyTokens);

	const isValid =
		uniqueTokens.size === nonEmptyTokens.length &&
		nonEmptyTokens.every((token) => sandboxTokens.has(token));

	if (!isValid) {
		return {
			kind: "fallback",
			reason: "must only list known sandbox tokens, each once",
			value: null,
		};
	}

	return null;
};

/*
 * An allow (the iframe's Permissions Policy) is valid if it isn't empty and it's at most 1000 characters long. An invalid
 * one is removed.
 */
const validateAllow: ValidateAttrFn<string | null> = ({ value }) => {
	const maxAllowLength = 1000;

	if (value.trim() === "") {
		return { kind: "fallback", reason: "must not be empty", value: null };
	}

	if (value.length > maxAllowLength) {
		return {
			kind: "fallback",
			reason: `must be at most ${maxAllowLength} characters long`,
			value: null,
		};
	}

	return null;
};

/*
 * A loading is valid if it's "lazy" or "eager". An invalid one is removed.
 */
const validateLoading: ValidateAttrFn<string | null> = ({ value }) => {
	if (value !== "lazy" && value !== "eager") {
		return {
			kind: "fallback",
			reason: 'must be "lazy" or "eager"',
			value: null,
		};
	}

	return null;
};

/*
 * Rejects every src: which sites an Embed frames is the consumer's decision, so an Embed frames nothing until its src
 * validator is given. Framing any page (e.g. one of the app's own) would let it reach the editor's page despite the
 * sandbox, so the consumer's validator should only accept the embed URLs of the sites they trust.
 */
const validateSrc: ValidateAttrFn<string> = () => {
	return {
		kind: "reject",
		reason: "isn't allowed: no site is allowed until the Embed's src validator is given",
	};
};

/*
 * Creates the Embed's attribute validators: the defaults, replaced by the given ones of the same attributes (see
 * createComponentAttrValidators). The src's default rejects every src (see validateSrc).
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
				src: validateSrc,
				title: validateTitle,
				sandbox: validateSandbox,
				allow: validateAllow,
				loading: validateLoading,
				[aspectRatioAttr.name]: validateAspectRatio,
			},
		},
		validatorOverrides,
	});

	return embedAttrValidators;
};
