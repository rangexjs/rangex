import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateEmptyMediaParams extends ValidateComponentParams {}

export type ValidateEmptyMediaResult = ValidateComponentResult;

export interface CreateEmptyMediaValidatorParams {}

export type CreateEmptyMediaValidatorResult = ComponentValidator;
