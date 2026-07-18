import type { EditorAPI } from "rich-text-area";
import type { EmojiPort } from "#ports";

export interface HandlePopoverAppearanceParams {
	emojiPort: EmojiPort;
	editorAPI: EditorAPI;
}
