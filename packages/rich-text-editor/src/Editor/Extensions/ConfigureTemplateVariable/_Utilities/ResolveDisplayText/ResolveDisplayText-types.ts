import type { TemplateVariableKind } from "#adapters";
import type { TemplateVariableRootStorage } from "../../TemplateVariableStorage";

export interface ResolveTemplateVariableDisplayTextParams {
	type: TemplateVariableKind;
	storage: TemplateVariableRootStorage;
}
