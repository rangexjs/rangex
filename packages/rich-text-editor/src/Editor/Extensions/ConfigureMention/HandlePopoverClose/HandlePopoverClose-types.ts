import type { EditorAPI } from "rich-text-area";
import type { MentionEditorPort } from "#adapters";

export interface CloseOnSelectionChangeParams {
	editorPort: MentionEditorPort;
	editorAPI: EditorAPI;
}

export interface CloseOnEditorBlurParams {
	editorPort: MentionEditorPort;
	editorAPI: EditorAPI;
}

export interface RestoreFocusOnEscapeParams {
	editorPort: MentionEditorPort;
	editorAPI: EditorAPI;
}

export interface HandlePopoverCloseParams {
	editorPort: MentionEditorPort;
	editorAPI: EditorAPI;
}
