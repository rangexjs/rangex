import type { TemplateVariableFields } from "#adapters/TemplateVariable";

export interface ValidateTemplateVariableFieldParams {
	fieldName: string;
	value: string;
	storage: TemplateVariableFields;
}

export interface TemplateVariableFieldMismatch {
	field: "fieldName" | "value";
	reason: string;
}

export type ValidateTemplateVariableFieldResult = TemplateVariableFieldMismatch | null;
