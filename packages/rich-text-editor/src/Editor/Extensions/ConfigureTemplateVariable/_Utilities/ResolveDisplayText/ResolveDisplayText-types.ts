import type { TemplateVariableKind } from "#adapters";
import type { TemplateVariableValues } from "../../../../Storage";

export interface ResolveTemplateVariableDisplayTextParams {
	type: TemplateVariableKind;
	storage: TemplateVariableValues;
}
