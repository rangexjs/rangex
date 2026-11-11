import type { ValidateAttrFn } from "../../DOMAttrs-types";

/*
 * An aspect ratio is valid if it's at most 32 characters long, and two positive numbers separated by " / " (e.g.
 * "16 / 9").
 */
export const validateAspectRatio: ValidateAttrFn<string | null> = ({
	value,
}) => {
	const maxAspectRatioLength = 32;

	if (value.length > maxAspectRatioLength) {
		return {
			kind: "fallback",
			reason: `must be at most ${maxAspectRatioLength} characters long`,
			value: null,
		};
	}

	// Two numbers separated by " / ", as CSS writes a ratio (e.g. "16 / 9")
	const match = /^(\d+(?:\.\d+)?) \/ (\d+(?:\.\d+)?)$/.exec(value);

	if (!match) {
		return {
			kind: "fallback",
			reason: 'must be two numbers separated by " / " (e.g. "16 / 9")',
			value: null,
		};
	}

	const [, width, height] = match;

	if (!(Number(width) > 0 && Number(height) > 0)) {
		return {
			kind: "fallback",
			reason: "must be two positive numbers",
			value: null,
		};
	}

	return null;
};
