import type { DOMAttrs } from "@rangex/core";
import type { AttrRules } from "../AttrRules-types";
import type {
	ValidateDOMAttrsParams,
	ValidateDOMAttrsResult,
} from "./ValidateDOMAttrs-types";

// Own keys only, so an attribute named like an Object.prototype member (e.g. "constructor") isn't found there
const getAttrRule = (attrRules: AttrRules, attrName: string) =>
	Object.hasOwn(attrRules, attrName) ? attrRules[attrName] : undefined;

const getAttrValue = (domAttrs: DOMAttrs, attrName: string) =>
	Object.hasOwn(domAttrs, attrName) ? domAttrs[attrName] : undefined;

/*
 * Validates a node's domAttrs by its AttrRules: every attribute must have a rule and pass it, and every required one
 * must be set. Returns the first mismatch, or null when the domAttrs are valid.
 */
export const validateDOMAttrs = ({
	domAttrs,
	attrRules,
}: ValidateDOMAttrsParams): ValidateDOMAttrsResult => {
	for (const [attrName, value] of Object.entries(domAttrs)) {
		if (value === undefined) {
			continue;
		}

		const attrRule = getAttrRule(attrRules, attrName);

		if (!attrRule) {
			return { kind: "unknown-attr", attrName };
		}

		const attrRuleFailed = attrRule.validate({ value });

		if (attrRuleFailed) {
			return { kind: "invalid-attr", attrName, attrRuleFailed };
		}
	}

	for (const [attrName, attrRule] of Object.entries(attrRules)) {
		if (!attrRule?.required) {
			continue;
		}

		const value = getAttrValue(domAttrs, attrName);

		if (value === undefined) {
			return { kind: "missing-attr", attrName };
		}
	}

	return null;
};
