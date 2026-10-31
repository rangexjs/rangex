import type {
	TemplateVariableFields,
	TemplateVariableFieldsConfig,
	ValidateFieldNameResult,
	ValidateFieldValueResult,
} from "#adapters/TemplateVariable";

export interface ValidateTemplateVariableFieldNameParams {
	fieldName: string;
}

export type ValidateTemplateVariableFieldNameResult = ValidateFieldNameResult;

export interface ValidateTemplateVariableFieldValueParams {
	value: string;
}

export type ValidateTemplateVariableFieldValueResult = ValidateFieldValueResult;

export interface ValidateTemplateVariablePlacementParams {
	fieldName: string;
	fieldsConfig: TemplateVariableFieldsConfig;
	storage: TemplateVariableFields;
}

export interface TemplateVariablePlacementMismatch {
	field: "fieldName";
	reason: string;
}

export type ValidateTemplateVariablePlacementResult =
	TemplateVariablePlacementMismatch | null;
