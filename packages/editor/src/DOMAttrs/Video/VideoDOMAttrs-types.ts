import type {
	ComponentAttrs,
	ComponentAttrsMismatch,
	ComponentAttrsPatch,
	ComponentAttrValidatorOverrides,
	ComponentAttrValidators,
} from "../_Utilities";
import type { videoAttrsShape } from "./VideoDOMAttrs";

export type VideoAttrsShape = typeof videoAttrsShape;

export type VideoAttrs = ComponentAttrs<VideoAttrsShape>;

export type VideoAttrsPatch = ComponentAttrsPatch<VideoAttrsShape>;

export type VideoAttrValidators = ComponentAttrValidators<VideoAttrsShape>;

export type VideoAttrsMismatch = ComponentAttrsMismatch<VideoAttrsShape>;

export type CreateVideoAttrValidatorsParams = ComponentAttrValidatorOverrides<VideoAttrsShape>;

export type CreateVideoAttrValidatorsResult = VideoAttrValidators;
