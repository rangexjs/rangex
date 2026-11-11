import type { ImageAttrs, ImageAttrsMismatch, ImageAttrValidators } from "#dom-attrs";

export interface ValidateImagePlacementParams {
	attrValidators: ImageAttrValidators;
	attrs: ImageAttrs;
}

export type ValidateImagePlacementResult = ImageAttrsMismatch | null;
