import { accordionItemAttrsShape, validateComponentAttrs } from "#dom-attrs";
import type {
	ValidateAccordionItemPlacementParams,
	ValidateAccordionItemPlacementResult,
} from "./ValidateAccordionItemPlacement-types";

/*
 * Validates whether an AccordionItem can be placed (inserted, wrapped or turned into) with the given attributes. Returns
 * the mismatch, or null when they're valid.
 */
export const validateAccordionItemPlacement = ({
	attrValidators,
	attrs,
}: ValidateAccordionItemPlacementParams): ValidateAccordionItemPlacementResult => {
	const attrsMismatch = validateComponentAttrs({
		componentAttrs: attrs,
		componentAttrsShape: accordionItemAttrsShape,
		componentAttrValidators: attrValidators,
	});

	if (attrsMismatch) {
		return attrsMismatch;
	}

	return null;
};
