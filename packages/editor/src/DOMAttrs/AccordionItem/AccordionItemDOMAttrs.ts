import { htmlLayoutRole, xhtmlNamespaceURI } from "@rangex/core";

import {
	type ComponentAttrsShape,
	createComponentAttrValidators,
	type ElementAttrsShape,
	type ElementDescriptor,
	validateBooleanAttr,
} from "../_Utilities";
import type {
	CreateAccordionItemAttrValidatorsParams,
	CreateAccordionItemAttrValidatorsResult,
} from "./AccordionItemDOMAttrs-types";

const detailsAttrsShape = {
	open: "optional",
} as const satisfies ElementAttrsShape;

const detailsElement: ElementDescriptor = {
	localName: "details",
	namespaceURI: xhtmlNamespaceURI,
	editorRole: htmlLayoutRole,
};

export const accordionItemAttrsShape = {
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
		elementDescriptors: { details: detailsElement },
		defaultValidators: {
			details: {
				open: validateBooleanAttr,
			},
		},
		validatorOverrides,
	});

	return accordionItemAttrValidators;
};
