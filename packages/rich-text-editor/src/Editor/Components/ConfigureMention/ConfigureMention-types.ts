import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface ConfigureMentionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
