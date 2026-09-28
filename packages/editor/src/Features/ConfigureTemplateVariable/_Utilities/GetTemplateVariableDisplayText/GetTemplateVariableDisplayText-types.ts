import type {
	TemplateVariableFields,
	TemplateVariableFieldsConfig,
} from "#adapters/TemplateVariable";

export interface GetTemplateVariableDisplayTextParams {
	fieldName: string;
	fieldsConfig: TemplateVariableFieldsConfig;
	storage: TemplateVariableFields;
}
