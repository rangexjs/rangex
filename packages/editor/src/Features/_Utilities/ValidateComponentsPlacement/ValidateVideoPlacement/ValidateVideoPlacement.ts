import { validateComponentAttrs, videoAttrsShape } from "#dom-attrs";
import type {
	ValidateVideoPlacementParams,
	ValidateVideoPlacementResult,
} from "./ValidateVideoPlacement-types";

/*
 * Validates whether a video can be placed with the given attributes. Returns the mismatch, or null when they're
 * valid.
 */
export const validateVideoPlacement = ({
	attrValidators,
	attrs,
}: ValidateVideoPlacementParams): ValidateVideoPlacementResult => {
	const attrsMismatch = validateComponentAttrs({
		componentAttrs: attrs,
		componentAttrsShape: videoAttrsShape,
		componentAttrValidators: attrValidators,
	});

	if (attrsMismatch) {
		return attrsMismatch;
	}

	return null;
};
