import type {
	AnyElementAttrs,
	AnyElementAttrValidators,
	ElementAttrsMismatch,
	ElementAttrsShape,
} from "../DOMAttrs-types";

export interface ValidateElementAttrsParams {
	elementAttrs: AnyElementAttrs;
	elementAttrsShape: ElementAttrsShape;
	elementAttrValidators: AnyElementAttrValidators;
}

export type ValidateElementAttrsResult = ElementAttrsMismatch | null;
