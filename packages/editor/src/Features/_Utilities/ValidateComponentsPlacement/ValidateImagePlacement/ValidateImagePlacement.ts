import { imageAttrsShape, validateComponentAttrs } from "#dom-attrs";

import type {
	ValidateImagePlacementParams,
	ValidateImagePlacementResult,
} from "./ValidateImagePlacement-types";

/*
 * Validates whether an image can be placed with the given attributes. Returns the mismatch, or null when they're
 * valid.
 */
export const validateImagePlacement = ({
	attrValidators,
	attrs,
}: ValidateImagePlacementParams): ValidateImagePlacementResult => {
	const attrsMismatch = validateComponentAttrs({
		componentAttrs: attrs,
		componentAttrsShape: imageAttrsShape,
		componentAttrValidators: attrValidators,
	});

	if (attrsMismatch) {
		return attrsMismatch;
	}

	return null;
};
