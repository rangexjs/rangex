import type { TemplateVariableKind } from "#adapters/TemplateVariable";
import type { TemplateVariableValues } from "#engine-links";

export interface ResolveTemplateVariableDisplayTextParams {
	type: TemplateVariableKind;
	storage: TemplateVariableValues;
}
