import type { EditorAPI } from "@rangex/core";

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
