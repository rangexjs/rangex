import type { EditorAPI } from "rich-text-area";
import type { EmojiPort } from "#ports";

export interface ConfigureEmojiParams {
	emojiPort: EmojiPort;
	editorAPI: EditorAPI;
}
