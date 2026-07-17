import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface HandleHistoryNavigationParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
