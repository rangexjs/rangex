import type {
	EmbedAttrs,
	EmbedAttrsMismatch,
	EmbedAttrValidators,
} from "#dom-attrs";

export interface ValidateEmbedPlacementParams {
	attrValidators: EmbedAttrValidators;
	attrs: EmbedAttrs;
}

export type ValidateEmbedPlacementResult = EmbedAttrsMismatch | null;
