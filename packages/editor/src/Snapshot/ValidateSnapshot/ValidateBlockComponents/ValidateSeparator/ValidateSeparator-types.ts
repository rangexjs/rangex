import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateSeparatorParams extends ValidateComponentParams {}

export type ValidateSeparatorResult = ValidateComponentResult;

export interface CreateSeparatorValidatorParams {}

export type CreateSeparatorValidatorResult = ComponentValidator;
