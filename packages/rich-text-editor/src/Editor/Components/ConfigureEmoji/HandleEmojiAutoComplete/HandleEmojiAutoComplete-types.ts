import type { EditorAPI } from "rich-text-area";
import type { EmojiPort } from "#ports";

export interface HandleEmojiAutoCompleteParams {
	emojiPort: EmojiPort;
	editorAPI: EditorAPI;
}
