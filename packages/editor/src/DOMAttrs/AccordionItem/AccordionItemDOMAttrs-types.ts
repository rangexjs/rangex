import type {
	ComponentAttrs,
	ComponentAttrsMismatch,
	ComponentAttrsPatch,
	ComponentAttrValidatorOverrides,
	ComponentAttrValidators,
} from "../_Utilities";
import type { accordionItemAttrsShape } from "./AccordionItemDOMAttrs";

export type AccordionItemAttrsShape = typeof accordionItemAttrsShape;

export type AccordionItemAttrs = ComponentAttrs<AccordionItemAttrsShape>;

export type AccordionItemAttrsPatch = ComponentAttrsPatch<AccordionItemAttrsShape>;

export type AccordionItemAttrValidators = ComponentAttrValidators<AccordionItemAttrsShape>;

export type AccordionItemAttrsMismatch = ComponentAttrsMismatch<AccordionItemAttrsShape>;

export type CreateAccordionItemAttrValidatorsParams =
	ComponentAttrValidatorOverrides<AccordionItemAttrsShape>;

export type CreateAccordionItemAttrValidatorsResult = AccordionItemAttrValidators;
