import type { EditorAPI } from "rich-text-area";
import type { EmojiConfigPort } from "#adapters/Emoji";

export interface HandleEmojiAutoCompleteParams {
	configPort: EmojiConfigPort;
	editorAPI: EditorAPI;
}
