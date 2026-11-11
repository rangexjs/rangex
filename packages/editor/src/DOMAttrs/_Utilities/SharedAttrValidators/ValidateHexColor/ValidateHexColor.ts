import type { ValidateAttrFn } from "../../DOMAttrs-types";

const hexColorPattern = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/*
 * A color is valid if it's a hex color of 3, 4, 6 or 8 digits. Without the DOM, it's the one format that can be checked
 * exactly.
 */
export const validateHexColor: ValidateAttrFn<string | null> = ({ value }) => {
	if (!hexColorPattern.test(value)) {
		return {
			kind: "fallback",
			reason: "must be a hex color",
			value: null,
		};
	}

	return null;
};
