import type { TemplateVariableKind } from "#ui";
import type { TemplateVariableRootStorage } from "../../TemplateVariableStorage";

export interface ResolveTemplateVariableDisplayTextParams {
	type: TemplateVariableKind;
	storage: TemplateVariableRootStorage;
}
