import type { EditorAPI } from "rich-text-area";
import type { MentionPopover, RichTextEditorUI } from "#ui";

export interface CloseOnSelectionChangeParams {
	mentionPopover: MentionPopover;
	editorAPI: EditorAPI;
}

export interface CloseOnEditorBlurParams {
	mentionPopover: MentionPopover;
	editorAPI: EditorAPI;
}

export interface RestoreFocusOnEscapeParams {
	mentionPopover: MentionPopover;
	editorAPI: EditorAPI;
}

export interface HandlePopoverCloseParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
}
