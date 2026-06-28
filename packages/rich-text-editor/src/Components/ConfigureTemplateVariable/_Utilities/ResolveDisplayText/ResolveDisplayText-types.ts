import type { TemplateVariableKind } from "@rangex/rich-text-editor-ui";
import type { TemplateVariableRootStorage } from "../../TemplateVariableStorage";

export interface ResolveTemplateVariableDisplayTextParams {
	type: TemplateVariableKind;
	storage: TemplateVariableRootStorage;
}
