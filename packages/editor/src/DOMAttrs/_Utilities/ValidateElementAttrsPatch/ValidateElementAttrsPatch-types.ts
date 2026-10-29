import type {
	AnyElementAttrs,
	AnyElementAttrValidators,
	ElementAttrsMismatch,
	ElementAttrsShape,
} from "../DOMAttrs-types";

export interface ValidateElementAttrsPatchParams {
	elementAttrsPatch: AnyElementAttrs;
	elementAttrsShape: ElementAttrsShape;
	elementAttrValidators: AnyElementAttrValidators;
}

export type ValidateElementAttrsPatchResult = ElementAttrsMismatch | null;
