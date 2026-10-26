// Not from "#engine-links": its other modules need a DOM, and the validation must run on a server
import { objectFitAttr } from "../../../../EngineLinks/Constants/AttrNames";
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
