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

type AudioAttrsFullPatch = ComponentAttrsPatch<AudioAttrsShape>;

export type AudioAttrsPatch = Omit<AudioAttrsFullPatch, "audio"> & {
	audio?: Omit<NonNullable<AudioAttrsFullPatch["audio"]>, "controls">;
};

export type AudioAttrValidators = ComponentAttrValidators<AudioAttrsShape>;

export type AudioAttrsMismatch = ComponentAttrsMismatch<AudioAttrsShape>;

type AudioAttrValidatorOverrides =
	ComponentAttrValidatorOverrides<AudioAttrsShape>;

export type CreateAudioAttrValidatorsParams = Omit<
	AudioAttrValidatorOverrides,
	"audio"
> & {
	audio?: Omit<NonNullable<AudioAttrValidatorOverrides["audio"]>, "controls">;
};

export type CreateAudioAttrValidatorsResult = AudioAttrValidators;
