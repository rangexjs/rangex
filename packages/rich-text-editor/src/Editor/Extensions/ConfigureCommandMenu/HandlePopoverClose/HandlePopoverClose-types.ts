import type { EditorAPI } from "rich-text-area";
import type { CommandMenuEditorPort } from "#adapters";

export interface CloseOnSelectionChangeParams {
	editorPort: CommandMenuEditorPort;
	editorAPI: EditorAPI;
}

export interface CloseOnEditorBlurParams {
	editorPort: CommandMenuEditorPort;
	editorAPI: EditorAPI;
}

export interface RestoreFocusOnEscapeParams {
	editorPort: CommandMenuEditorPort;
	editorAPI: EditorAPI;
}

export interface HandlePopoverCloseParams {
	editorPort: CommandMenuEditorPort;
	editorAPI: EditorAPI;
}
