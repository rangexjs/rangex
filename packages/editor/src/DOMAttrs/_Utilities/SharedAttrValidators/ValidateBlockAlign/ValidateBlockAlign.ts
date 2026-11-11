import { blockAlignAttr } from "#constants";
import type { ValidateAttrFn } from "../../DOMAttrs-types";

/*
 * A block align is valid if it's "left", "center" or "right". An invalid one falls back to "center", the alignment a
 * block is created with.
 */
export const validateBlockAlign: ValidateAttrFn<string> = ({ value }) => {
	const allowedBlockAligns = new Set<string>(
		Object.values(blockAlignAttr.value),
	);

	if (!allowedBlockAligns.has(value)) {
		return {
			kind: "fallback",
			reason: `must be ${[...allowedBlockAligns].join(", ")}`,
			value: blockAlignAttr.value.center,
		};
	}

	return null;
};
