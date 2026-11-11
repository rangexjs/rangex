import type { CreateEmbedAttrValidatorsParams, EmbedAttrValidators } from "#dom-attrs";

import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateEmbedParams extends ValidateComponentParams {
	attrValidators: EmbedAttrValidators;
}

export type ValidateEmbedResult = ValidateComponentResult;

export interface CreateEmbedValidatorParams {
	attrValidators?: CreateEmbedAttrValidatorsParams;
}

export type CreateEmbedValidatorResult = ComponentValidator;
