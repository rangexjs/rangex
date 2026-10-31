import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateMentionParams extends ValidateComponentParams {}

export type ValidateMentionResult = ValidateComponentResult;

export interface CreateMentionValidatorParams {}

export type CreateMentionValidatorResult = ComponentValidator;
