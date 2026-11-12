import { blockComponentRole, xhtmlNamespaceURI } from "@rangex/core";

import {
	type ComponentAttrsShape,
	createComponentAttrValidators,
	type ElementAttrsShape,
	type ElementDescriptor,
	validateHexColor,
} from "../_Utilities";
import type {
	CreateCodeBlockAttrValidatorsParams,
	CreateCodeBlockAttrValidatorsResult,
} from "./CodeBlockDOMAttrs-types";

/*
 * The theme's colors, set by the highlighter and read by the CodeBlock's styles through attr()
 */
const codeBlockElementAttrsShape = {
	"data-bg-light": "optional",
	"data-bg-dark": "optional",
	"data-fg-light": "optional",
	"data-fg-dark": "optional",
} as const satisfies ElementAttrsShape;

const codeBlockElement: ElementDescriptor = {
	localName: "div",
	namespaceURI: xhtmlNamespaceURI,
	editorRole: blockComponentRole,
};

export const codeBlockAttrsShape = {
	codeBlock: codeBlockElementAttrsShape,
} as const satisfies ComponentAttrsShape;

/*
 * Creates the CodeBlock's attribute validators: the defaults, replaced by the given ones of the same attributes (see
 * createComponentAttrValidators).
 */
export const createCodeBlockAttrValidators = (
	validatorOverrides: CreateCodeBlockAttrValidatorsParams,
): CreateCodeBlockAttrValidatorsResult => {
	const codeBlockAttrValidators = createComponentAttrValidators({
		componentAttrsShape: codeBlockAttrsShape,
		elementDescriptors: { codeBlock: codeBlockElement },
		defaultValidators: {
			codeBlock: {
				"data-bg-light": validateHexColor,
				"data-bg-dark": validateHexColor,
				"data-fg-light": validateHexColor,
				"data-fg-dark": validateHexColor,
			},
		},
		validatorOverrides,
	});

	return codeBlockAttrValidators;
};
