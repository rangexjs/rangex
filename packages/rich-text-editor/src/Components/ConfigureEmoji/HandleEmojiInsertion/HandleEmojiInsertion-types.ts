import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";

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
