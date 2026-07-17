import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface ConfigureEmojiParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
