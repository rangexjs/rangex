import type { EditorAPI } from "rich-text-area";
import type { EmojiPort } from "#ports";

export interface HandleEmojiInsertionParams {
	emojiPort: EmojiPort;
	editorAPI: EditorAPI;
}

export interface RemoveEmojiQueryTextParams {
	editorAPI: EditorAPI;
}

export interface RemoveEmojiQueryTextResult {
	queryFound: boolean;
}
