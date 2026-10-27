import type {
	CreateImageAttrValidatorsParams,
	ImageAttrValidators,
} from "#dom-attrs";
import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateImageParams extends ValidateComponentParams {
	attrValidators: ImageAttrValidators;
}

export type ValidateImageResult = ValidateComponentResult;

export interface CreateImageValidatorParams {
	attrValidators?: CreateImageAttrValidatorsParams;
}

export type CreateImageValidatorResult = ComponentValidator;
