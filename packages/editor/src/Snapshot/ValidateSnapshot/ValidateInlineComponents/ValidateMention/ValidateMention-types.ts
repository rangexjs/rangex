import type { MentionStorage } from "#storage";
import type { ValidateStorageFn } from "../../_Utilities";
import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateMentionParams extends ValidateComponentParams {
	validateStorage: ValidateStorageFn<MentionStorage> | undefined;
}

export type ValidateMentionResult = ValidateComponentResult;

export interface CreateMentionValidatorParams {
	validateStorage?: ValidateStorageFn<MentionStorage>;
}

export type CreateMentionValidatorResult = ComponentValidator;
