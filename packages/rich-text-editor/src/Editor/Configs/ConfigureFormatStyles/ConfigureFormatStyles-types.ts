import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface ConfigureFormatStylesParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
