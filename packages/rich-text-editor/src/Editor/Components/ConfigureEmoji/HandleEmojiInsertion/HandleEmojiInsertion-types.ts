import type { EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";

export interface HandleEmojiInsertionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}

export interface RemoveEmojiQueryTextParams {
	editorAPI: EditorAPI;
}

export interface RemoveEmojiQueryTextResult {
	queryFound: boolean;
}
