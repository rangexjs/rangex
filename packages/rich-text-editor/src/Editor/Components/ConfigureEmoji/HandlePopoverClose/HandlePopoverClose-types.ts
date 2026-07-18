import type { EditorAPI } from "rich-text-area";
import type { EmojiPort } from "#ports";

export interface CloseOnSelectionChangeParams {
	emojiPort: EmojiPort;
	editorAPI: EditorAPI;
}

export interface CloseOnEditorBlurParams {
	emojiPort: EmojiPort;
	editorAPI: EditorAPI;
}

export interface RestoreFocusOnEscapeParams {
	emojiPort: EmojiPort;
	editorAPI: EditorAPI;
}

export interface HandlePopoverCloseParams {
	emojiPort: EmojiPort;
	editorAPI: EditorAPI;
}
