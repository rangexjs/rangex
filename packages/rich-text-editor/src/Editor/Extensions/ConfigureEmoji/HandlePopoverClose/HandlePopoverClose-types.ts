import type { EditorAPI } from "rich-text-area";
import type { EmojiEditorPort } from "#adapters";

export interface CloseOnSelectionChangeParams {
	editorPort: EmojiEditorPort;
	editorAPI: EditorAPI;
}

export interface CloseOnEditorBlurParams {
	editorPort: EmojiEditorPort;
	editorAPI: EditorAPI;
}

export interface RestoreFocusOnEscapeParams {
	editorPort: EmojiEditorPort;
	editorAPI: EditorAPI;
}

export interface HandlePopoverCloseParams {
	editorPort: EmojiEditorPort;
	editorAPI: EditorAPI;
}
