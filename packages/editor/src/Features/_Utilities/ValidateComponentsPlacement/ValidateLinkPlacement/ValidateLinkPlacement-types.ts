import type { LinkAttrs, LinkAttrsMismatch, LinkAttrValidators } from "#dom-attrs";

export interface ValidateLinkPlacementParams {
	attrValidators: LinkAttrValidators;
	attrs: LinkAttrs;
}

export type ValidateLinkPlacementResult = LinkAttrsMismatch | null;
