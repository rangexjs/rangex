import type { VideoAttrs, VideoAttrsMismatch, VideoAttrValidators } from "#dom-attrs";

export interface ValidateVideoPlacementParams {
	attrValidators: VideoAttrValidators;
	attrs: VideoAttrs;
}

export type ValidateVideoPlacementResult = VideoAttrsMismatch | null;
