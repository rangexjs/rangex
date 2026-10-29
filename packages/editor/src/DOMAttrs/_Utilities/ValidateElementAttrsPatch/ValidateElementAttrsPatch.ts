import type {
	ValidateElementAttrsPatchParams,
	ValidateElementAttrsPatchResult,
} from "./ValidateElementAttrsPatch-types";

// Own keys only, so an attribute named like an Object.prototype member (e.g. "constructor") isn't found there
const getOwn = <Value>(
	record: Partial<Record<string, Value>>,
	key: string,
): Value | undefined => (Object.hasOwn(record, key) ? record[key] : undefined);

/*
 * Validates only the given attributes of an element by its shape and validators: every attribute must be in the shape,
 * and every set one must pass its validator. A required attribute that isn't given isn't checked. An attribute that is
 * null or undefined isn't set. Returns the first mismatch, or null when the attributes are valid.
 */
export const validateElementAttrsPatch = ({
	elementAttrsPatch,
	elementAttrsShape,
	elementAttrValidators,
}: ValidateElementAttrsPatchParams): ValidateElementAttrsPatchResult => {
	for (const [attrName, value] of Object.entries(elementAttrsPatch)) {
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

	return null;
};
