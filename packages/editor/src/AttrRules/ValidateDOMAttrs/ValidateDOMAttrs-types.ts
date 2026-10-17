import type { DOMAttrs } from "@rangex/core";
import type { AttrRuleFailed, AttrRules } from "../AttrRules-types";

export interface ValidateDOMAttrsParams {
	domAttrs: DOMAttrs;
	attrRules: AttrRules;
}

export interface UnknownAttrMismatch {
	kind: "unknown-attr";
	attrName: string;
}

export interface MissingAttrMismatch {
	kind: "missing-attr";
	attrName: string;
}

export interface InvalidAttrMismatch {
	kind: "invalid-attr";
	attrName: string;
	attrRuleFailed: AttrRuleFailed;
}

export type DOMAttrsMismatch =
	| UnknownAttrMismatch
	| MissingAttrMismatch
	| InvalidAttrMismatch;

export type ValidateDOMAttrsResult = DOMAttrsMismatch | null;
