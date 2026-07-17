import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface HandleResultsSyncParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
