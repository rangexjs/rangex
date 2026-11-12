import { embedAttrsShape, validateComponentAttrs } from "#dom-attrs";

import type {
	ValidateEmbedPlacementParams,
	ValidateEmbedPlacementResult,
} from "./ValidateEmbedPlacement-types";

/*
 * Validates whether an embed can be placed with the given attributes. Returns the mismatch, or null when they're
 * valid.
 */
export const validateEmbedPlacement = ({
	attrValidators,
	attrs,
}: ValidateEmbedPlacementParams): ValidateEmbedPlacementResult => {
	const attrsMismatch = validateComponentAttrs({
		componentAttrs: attrs,
		componentAttrsShape: embedAttrsShape,
		componentAttrValidators: attrValidators,
	});

	if (attrsMismatch) {
		return attrsMismatch;
	}

	return null;
};
