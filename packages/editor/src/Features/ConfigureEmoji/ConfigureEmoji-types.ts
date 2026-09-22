import type { EditorAPI } from "rich-text-area";
import type { EmojiConfigPort } from "#adapters/Emoji";

export interface ConfigureEmojiParams {
	configPort: EmojiConfigPort;
	editorAPI: EditorAPI;
}
