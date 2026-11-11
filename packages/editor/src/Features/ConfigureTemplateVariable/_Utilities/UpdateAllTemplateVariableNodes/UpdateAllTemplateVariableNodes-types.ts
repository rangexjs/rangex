import type { RootEditable } from "@rangex/core";

import type {
	TemplateVariableFields,
	TemplateVariableFieldsConfig,
} from "#adapters/TemplateVariable";

export interface UpdateAllTemplateVariableNodesParams {
	rootEditable: RootEditable;
	storage: TemplateVariableFields;
	fieldsConfig: TemplateVariableFieldsConfig;
}
