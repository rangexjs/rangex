import type { EditorAPI, RootEditable } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";
import type { TemplateVariableRootStorage } from "../TemplateVariableStorage";

export interface HandleTemplateVariableUpdateParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}

export interface UpdateAllTemplateVariableNodesParams {
	rootEditable: RootEditable;
	storage: TemplateVariableRootStorage;
}
