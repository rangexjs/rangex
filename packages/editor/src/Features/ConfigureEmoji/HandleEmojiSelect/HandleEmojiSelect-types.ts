import type { EditorAPI } from "rich-text-area";
import type { EmojiConfigPort } from "#adapters/Emoji";

export interface HandleEmojiSelectParams {
	configPort: EmojiConfigPort;
	editorAPI: EditorAPI;
}

export interface RemoveEmojiQueryTextParams {
	editorAPI: EditorAPI;
}

export interface RemoveEmojiQueryTextResult {
	queryFound: boolean;
}
