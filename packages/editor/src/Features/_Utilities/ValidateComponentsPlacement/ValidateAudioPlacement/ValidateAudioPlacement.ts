import { audioAttrsShape, validateComponentAttrs } from "#dom-attrs";
import type {
	ValidateAudioPlacementParams,
	ValidateAudioPlacementResult,
} from "./ValidateAudioPlacement-types";

/*
 * Validates whether an audio can be placed with the given attributes. Returns the mismatch, or null when they're
 * valid.
 */
export const validateAudioPlacement = ({
	attrValidators,
	attrs,
}: ValidateAudioPlacementParams): ValidateAudioPlacementResult => {
	const attrsMismatch = validateComponentAttrs({
		componentAttrs: attrs,
		componentAttrsShape: audioAttrsShape,
		componentAttrValidators: attrValidators,
	});

	if (attrsMismatch) {
		return attrsMismatch;
	}

	return null;
};
