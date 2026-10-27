import type {
	AudioAttrValidators,
	CreateAudioAttrValidatorsParams,
} from "#dom-attrs";
import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateAudioParams extends ValidateComponentParams {
	attrValidators: AudioAttrValidators;
}

export type ValidateAudioResult = ValidateComponentResult;

export interface CreateAudioValidatorParams {
	attrValidators?: CreateAudioAttrValidatorsParams;
}

export type CreateAudioValidatorResult = ComponentValidator;
