import type { EditorAPI } from "@rangex/core";
import type { EmojiConfigPort } from "#adapters/Emoji";

export interface HandleEmojiAutoCompleteParams {
	configPort: EmojiConfigPort;
	editorAPI: EditorAPI;
}
