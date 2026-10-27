import type {
	CreateVideoAttrValidatorsParams,
	VideoAttrValidators,
} from "#dom-attrs";
import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateVideoParams extends ValidateComponentParams {
	attrValidators: VideoAttrValidators;
}

export type ValidateVideoResult = ValidateComponentResult;

export interface CreateVideoValidatorParams {
	attrValidators?: CreateVideoAttrValidatorsParams;
}

export type CreateVideoValidatorResult = ComponentValidator;
