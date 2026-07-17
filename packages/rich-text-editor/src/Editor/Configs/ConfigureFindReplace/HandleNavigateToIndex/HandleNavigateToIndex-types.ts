import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface HandleNavigateToIndexParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
