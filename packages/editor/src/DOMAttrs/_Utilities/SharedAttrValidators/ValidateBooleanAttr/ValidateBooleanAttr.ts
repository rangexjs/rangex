import type { ValidateAttrFn } from "../../DOMAttrs-types";

/*
 * A boolean attribute (e.g. controls) is valid if it's empty: it's set or not, its value means nothing. Any other value
 * falls back to an empty one, so the attribute stays set.
 */
export const validateBooleanAttr: ValidateAttrFn<string | null> = ({
	value,
}) => {
	if (value !== "") {
		return { kind: "fallback", reason: "must be empty", value: "" };
	}

	return null;
};
