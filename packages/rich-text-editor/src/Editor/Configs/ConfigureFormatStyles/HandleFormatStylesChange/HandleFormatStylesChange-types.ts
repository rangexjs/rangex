import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface HandleFormatStylesChangeParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
