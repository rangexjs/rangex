import { assertNever } from "#utilities";
import type {
	ValidateElementAttrsParams,
	ValidateElementAttrsResult,
} from "./ValidateElementAttrs-types";

// Own keys only, so an attribute named like an Object.prototype member (e.g. "constructor") isn't found there
const getOwn = <Value>(
	record: Partial<Record<string, Value>>,
	key: string,
): Value | undefined => (Object.hasOwn(record, key) ? record[key] : undefined);

/*
 * Validates an element's attributes by its shape and validators: every attribute must be in the shape, every set one
 * must pass its validator, and every required one must be set. An attribute that is null or undefined isn't set.
 * Returns the first mismatch, or null when the attributes are valid.
 */
export const validateElementAttrs = ({
	elementAttrs,
	elementAttrsShape,
	elementAttrValidators,
}: ValidateElementAttrsParams): ValidateElementAttrsResult => {
	for (const [attrName, value] of Object.entries(elementAttrs)) {
		const requirement = getOwn(elementAttrsShape, attrName);

		if (!requirement) {
			return { kind: "unknown-attr", attrName };
		}

		if (value === undefined || value === null) {
			continue;
		}

		const validateAttr = getOwn(elementAttrValidators, attrName);

		if (!validateAttr) {
			throw new Error(`Attribute "${attrName}" has no validator.`);
		}

		const validationFailed = validateAttr({ value });

		if (validationFailed) {
			return { kind: "invalid-attr", attrName, validationFailed };
		}
	}

	for (const [attrName, requirement] of Object.entries(elementAttrsShape)) {
		if (requirement === "optional") {
			continue;
		}

		if (requirement === "required") {
			const value = getOwn(elementAttrs, attrName);

			if (value === undefined || value === null) {
				return { kind: "missing-attr", attrName };
			}

			continue;
		}

		assertNever(requirement);
	}

	return null;
};
