import type { TemplateVariableStorage } from "#storage";
import type { ValidateStorageFn } from "../../_Utilities";
import type {
	ComponentValidator,
	ValidateComponentParams,
	ValidateComponentResult,
} from "../../ValidateSnapshot-types";

export interface ValidateTemplateVariableParams
	extends ValidateComponentParams {
	validateStorage: ValidateStorageFn<TemplateVariableStorage> | undefined;
}

export type ValidateTemplateVariableResult = ValidateComponentResult;

export interface CreateTemplateVariableValidatorParams {
	validateStorage?: ValidateStorageFn<TemplateVariableStorage>;
}

export type CreateTemplateVariableValidatorResult = ComponentValidator;
