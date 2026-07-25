import type { EditorAPI, RootEditable } from "rich-text-area";
import type { TemplateVariableEditorPort } from "#adapters";
import type { TemplateVariableRootStorage } from "../TemplateVariableStorage";

export interface HandleTemplateVariableUpdateParams {
	editorPort: TemplateVariableEditorPort;
	editorAPI: EditorAPI;
}

export interface UpdateAllTemplateVariableNodesParams {
	rootEditable: RootEditable;
	storage: TemplateVariableRootStorage;
}
