import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface HandleTemplateVariableToolbarButtonStateParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
