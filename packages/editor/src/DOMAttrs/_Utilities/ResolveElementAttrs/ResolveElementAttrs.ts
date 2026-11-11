import type { DOMAttrs } from "@rangex/core";

import type {
	ResolveElementAttrsParams,
	ResolveElementAttrsResult,
} from "./ResolveElementAttrs-types";

/*
 * Resolves the attributes an element should have by its shape and validators: an attribute that isn't in the shape is
 * left out, a missing required one is validated as "", and a value that falls back is replaced by the fallback (null
 * leaves the attribute out), which must then pass the validator itself. Returns the resolved attributes, or the first
 * attribute that is rejected.
 */
export const resolveElementAttrs = ({
	elementAttrs,
	elementAttrsShape,
	elementAttrValidators,
}: ResolveElementAttrsParams): ResolveElementAttrsResult => {
	const resolvedElementAttrs: DOMAttrs = {};

	for (const [attrName, requirement] of Object.entries(elementAttrsShape)) {
		const validateAttr = elementAttrValidators[attrName];

		if (!validateAttr) {
			throw new Error(`Attribute "${attrName}" has no validator.`);
		}

		const attrValue = elementAttrs[attrName] ?? null;

		if (attrValue === null && requirement === "optional") {
			continue;
		}

		const value = attrValue ?? "";

		const validationFailed = validateAttr({ value });

		if (!validationFailed) {
			resolvedElementAttrs[attrName] = value;
			continue;
		}

		if (validationFailed.kind === "reject") {
			return {
				kind: "invalid",
				mismatch: { kind: "invalid-attr", attrName, validationFailed },
			};
		}

		const fallbackValue = validationFailed.value;

		if (fallbackValue === null) {
			continue;
		}

		const fallbackValidationFailed = validateAttr({ value: fallbackValue });

		if (fallbackValidationFailed) {
			return {
				kind: "invalid",
				mismatch: {
					kind: "invalid-attr",
					attrName,
					validationFailed: fallbackValidationFailed,
				},
			};
		}

		resolvedElementAttrs[attrName] = fallbackValue;
	}

	return { kind: "valid", elementAttrs: resolvedElementAttrs };
};
