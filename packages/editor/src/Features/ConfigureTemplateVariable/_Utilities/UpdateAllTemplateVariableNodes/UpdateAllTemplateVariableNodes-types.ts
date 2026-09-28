import type { RootEditable } from "rich-text-area";
import type {
	TemplateVariableFields,
	TemplateVariableFieldsConfig,
} from "#adapters/TemplateVariable";

export interface UpdateAllTemplateVariableNodesParams {
	rootEditable: RootEditable;
	storage: TemplateVariableFields;
	fieldsConfig: TemplateVariableFieldsConfig;
}
