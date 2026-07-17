import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface HandleHistoryNavigationButtonStateParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
