import type {
	AccordionItemAttrs,
	AccordionItemAttrsMismatch,
	AccordionItemAttrValidators,
} from "#dom-attrs";

export interface ValidateAccordionItemPlacementParams {
	attrValidators: AccordionItemAttrValidators;
	attrs: AccordionItemAttrs;
}

export type ValidateAccordionItemPlacementResult = AccordionItemAttrsMismatch | null;
