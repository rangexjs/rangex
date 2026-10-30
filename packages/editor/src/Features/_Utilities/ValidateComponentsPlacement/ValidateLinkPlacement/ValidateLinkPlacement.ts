import {
	linkAttrsShape,
	normalizeLinkAttrs,
	validateComponentAttrs,
} from "#dom-attrs";
import type {
	ValidateLinkPlacementParams,
	ValidateLinkPlacementResult,
} from "./ValidateLinkPlacement-types";

/*
 * Validates whether a link can be placed (inserted or wrapped) with the given attributes: they're normalized, then
 * checked by the link's attribute validators. Returns the mismatch, or null when they're valid.
 */
export const validateLinkPlacement = ({
	attrValidators,
	attrs,
}: ValidateLinkPlacementParams): ValidateLinkPlacementResult => {
	const normalizedAttrs = normalizeLinkAttrs(attrs);

	const attrsMismatch = validateComponentAttrs({
		componentAttrs: normalizedAttrs,
		componentAttrsShape: linkAttrsShape,
		componentAttrValidators: attrValidators,
	});

	if (attrsMismatch) {
		return attrsMismatch;
	}

	return null;
};
