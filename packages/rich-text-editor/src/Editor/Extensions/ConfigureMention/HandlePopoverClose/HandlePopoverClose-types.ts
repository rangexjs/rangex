import type { EditorAPI } from "rich-text-area";
import type { MentionPort } from "#ports";

export interface CloseOnSelectionChangeParams {
	mentionPort: MentionPort;
	editorAPI: EditorAPI;
}

export interface CloseOnEditorBlurParams {
	mentionPort: MentionPort;
	editorAPI: EditorAPI;
}

export interface RestoreFocusOnEscapeParams {
	mentionPort: MentionPort;
	editorAPI: EditorAPI;
}

export interface HandlePopoverCloseParams {
	mentionPort: MentionPort;
	editorAPI: EditorAPI;
}
