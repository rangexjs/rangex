import type { TemplateVariableKind } from "@rangex/rich-text-editor-ui";
import type { TemplateVariableStore } from "../../TemplateVariableStorage";

export interface ResolveTemplateVariableDisplayTextParams {
	type: TemplateVariableKind;
	storage: TemplateVariableStore;
}
