import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateSourcePlaceholderParams
	extends ValidateComponentParams {}

export type ValidateSourcePlaceholderResult = ValidateComponentResult;

export interface CreateSourcePlaceholderValidatorParams {}

export type CreateSourcePlaceholderValidatorResult = ComponentValidator;
