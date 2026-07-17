import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI, RootEditable } from "rich-text-area";
import type { TemplateVariableRootStorage } from "../TemplateVariableStorage";

export interface HandleTemplateVariableUpdateParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}

export interface UpdateAllTemplateVariableNodesParams {
	rootEditable: RootEditable;
	storage: TemplateVariableRootStorage;
}
