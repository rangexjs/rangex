import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateMentionParams extends ValidateComponentParams {}

export type ValidateMentionResult = ValidateComponentResult;

export type CreateMentionValidatorResult = ComponentValidator;
