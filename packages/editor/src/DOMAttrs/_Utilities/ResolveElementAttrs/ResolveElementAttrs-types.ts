import type { DOMAttrs } from "@rangex/core";

import type {
	AnyElementAttrs,
	AnyElementAttrValidators,
	ElementAttrsShape,
	InvalidAttrMismatch,
} from "../DOMAttrs-types";

export interface ResolveElementAttrsParams {
	elementAttrs: AnyElementAttrs;
	elementAttrsShape: ElementAttrsShape;
	elementAttrValidators: AnyElementAttrValidators;
}

export interface ResolveElementAttrsValid {
	kind: "valid";
	elementAttrs: DOMAttrs;
}

export interface ResolveElementAttrsInvalid {
	kind: "invalid";
	mismatch: InvalidAttrMismatch;
}

export type ResolveElementAttrsResult = ResolveElementAttrsValid | ResolveElementAttrsInvalid;
