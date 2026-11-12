import { objectFitAttr } from "#constants";

import type { ValidateAttrFn } from "../../DOMAttrs-types";

export const validateObjectFit: ValidateAttrFn<string | null> = ({ value }) => {
	const allowedObjectFits = new Set<string>(Object.values(objectFitAttr.value));

	if (!allowedObjectFits.has(value)) {
		return {
			kind: "fallback",
			reason: `must be ${[...allowedObjectFits].join(", ")}`,
			value: null,
		};
	}

	return null;
};
