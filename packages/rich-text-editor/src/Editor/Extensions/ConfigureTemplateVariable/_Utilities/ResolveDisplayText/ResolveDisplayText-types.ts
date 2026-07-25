import type { TemplateVariableKind } from "#adapters";
import type { TemplateVariableRootStorage } from "../../../../Storage";

export interface ResolveTemplateVariableDisplayTextParams {
	type: TemplateVariableKind;
	storage: TemplateVariableRootStorage;
}
