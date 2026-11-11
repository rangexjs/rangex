import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateBlockQuoteParams extends ValidateComponentParams {}

export type ValidateBlockQuoteResult = ValidateComponentResult;

export interface CreateBlockQuoteValidatorParams {}

export type CreateBlockQuoteValidatorResult = ComponentValidator;
