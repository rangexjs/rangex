import type { EditorAPI } from "rich-text-area";
import type { EmojiPopover, RichTextEditorUI } from "#ui";

export interface CloseOnSelectionChangeParams {
	emojiPopover: EmojiPopover;
	editorAPI: EditorAPI;
}

export interface CloseOnEditorBlurParams {
	emojiPopover: EmojiPopover;
	editorAPI: EditorAPI;
}

export interface RestoreFocusOnEscapeParams {
	emojiPopover: EmojiPopover;
	editorAPI: EditorAPI;
}

export interface HandlePopoverCloseParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
