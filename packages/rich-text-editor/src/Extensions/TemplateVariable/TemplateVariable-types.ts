import type { TemplateVariableFieldsConfig } from "@rangex/editor";
import type { TemplateVariableDropdownItem } from "#context";

export interface TemplateVariableExtensionSettings<FieldName extends string> {
	fieldsConfig: TemplateVariableFieldsConfig<FieldName>;
	dropdown: TemplateVariableDropdownItem<NoInfer<FieldName>>[];
}
