import type { TemplateVariableFieldsConfig } from "@rangex/editor/template-variable";
import type { TemplateVariableDropdownItem } from "#context";

export interface TemplateVariableExtensionSettings<FieldName extends string> {
	fieldsConfig: TemplateVariableFieldsConfig<FieldName>;
	dropdown: TemplateVariableDropdownItem<NoInfer<FieldName>>[];
}
