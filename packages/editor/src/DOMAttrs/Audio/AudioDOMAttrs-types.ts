import type {
	ComponentAttrs,
	ComponentAttrsMismatch,
	ComponentAttrsPatch,
	ComponentAttrValidatorOverrides,
	ComponentAttrValidators,
} from "../_Utilities";
import type { audioAttrsShape } from "./AudioDOMAttrs";

export type AudioAttrsShape = typeof audioAttrsShape;

export type AudioAttrs = ComponentAttrs<AudioAttrsShape>;

export type AudioAttrsPatch = ComponentAttrsPatch<AudioAttrsShape>;

export type AudioAttrValidators = ComponentAttrValidators<AudioAttrsShape>;

export type AudioAttrsMismatch = ComponentAttrsMismatch<AudioAttrsShape>;

export type CreateAudioAttrValidatorsParams =
	ComponentAttrValidatorOverrides<AudioAttrsShape>;

export type CreateAudioAttrValidatorsResult = AudioAttrValidators;
