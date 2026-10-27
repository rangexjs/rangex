import type { ValidateAttrFn } from "../../DOMAttrs-types";

/*
 * A title is valid if it's at most 200 characters long.
 */
export const validateTitle: ValidateAttrFn<string | null> = ({ value }) => {
	const maxTitleLength = 200;

	if (value.length > maxTitleLength) {
		return {
			kind: "fallback",
			reason: `must be at most ${maxTitleLength} characters long`,
			value: null,
		};
	}

	return null;
};
