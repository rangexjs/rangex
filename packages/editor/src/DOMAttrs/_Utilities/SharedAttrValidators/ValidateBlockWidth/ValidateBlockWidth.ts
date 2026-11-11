import type { ValidateAttrFn } from "../../DOMAttrs-types";

/*
 * A block width is valid if it's a whole number of px, without its unit, between 300 and 10000.
 */
export const validateBlockWidth: ValidateAttrFn<string | null> = ({
	value,
}) => {
	// The block resize's minimum width
	const minBlockWidth = 300;
	const maxBlockWidth = 10000;

	const isWholeNumber = /^[1-9]\d*$/.test(value);

	if (!isWholeNumber) {
		return {
			kind: "fallback",
			reason: "must be a whole number of px, without its unit",
			value: null,
		};
	}

	const blockWidth = Number(value);

	if (blockWidth < minBlockWidth || blockWidth > maxBlockWidth) {
		return {
			kind: "fallback",
			reason: `must be between ${minBlockWidth} and ${maxBlockWidth}`,
			value: null,
		};
	}

	return null;
};
