import {
	blockComponentLineRole,
	htmlLayoutRole,
	xhtmlNamespaceURI,
} from "@rangex/core";
import { blockAlignAttr } from "#constants";
import {
	type ComponentAttrsShape,
	createComponentAttrValidators,
	type ElementAttrsShape,
	type ElementDescriptor,
	validateBlockAlign,
	validateBooleanAttr,
} from "../_Utilities";
import type {
	CreateAccordionItemAttrValidatorsParams,
	CreateAccordionItemAttrValidatorsResult,
} from "./AccordionItemDOMAttrs-types";

const lineAttrsShape = {
	[blockAlignAttr.name]: "required",
} as const satisfies ElementAttrsShape;

const detailsAttrsShape = {
	open: "optional",
} as const satisfies ElementAttrsShape;

const lineElement: ElementDescriptor = {
	localName: "div",
	namespaceURI: xhtmlNamespaceURI,
	editorRole: blockComponentLineRole,
};

const detailsElement: ElementDescriptor = {
	localName: "details",
	namespaceURI: xhtmlNamespaceURI,
	editorRole: htmlLayoutRole,
};

export const accordionItemAttrsShape = {
	line: lineAttrsShape,
	details: detailsAttrsShape,
} as const satisfies ComponentAttrsShape;

/*
 * Creates the AccordionItem's attribute validators: the defaults, replaced by the given ones of the same attributes (see
 * createComponentAttrValidators).
 */
export const createAccordionItemAttrValidators = (
	validatorOverrides: CreateAccordionItemAttrValidatorsParams,
): CreateAccordionItemAttrValidatorsResult => {
	const accordionItemAttrValidators = createComponentAttrValidators({
		componentAttrsShape: accordionItemAttrsShape,
		elementDescriptors: {
			line: lineElement,
			details: detailsElement,
		},
		defaultValidators: {
			line: {
				[blockAlignAttr.name]: validateBlockAlign,
			},
			details: {
				open: validateBooleanAttr,
			},
		},
		validatorOverrides,
	});

	return accordionItemAttrValidators;
};
