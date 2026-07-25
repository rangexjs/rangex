import type { EditorAPI } from "rich-text-area";
import type { EmojiEditorPort } from "#adapters";

export interface HandleEmojiInsertionParams {
	editorPort: EmojiEditorPort;
	editorAPI: EditorAPI;
}

export interface RemoveEmojiQueryTextParams {
	editorAPI: EditorAPI;
}

export interface RemoveEmojiQueryTextResult {
	queryFound: boolean;
}
