import type {
	MentionPopover,
	RichTextEditorUI,
} from "@rangex/rich-text-editor-ui";
import type { EditorAPI } from "rich-text-area";

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
