import type { EditorAPI } from "rich-text-area";
import type { CommandMenuEditorPort } from "#adapters";

export interface RemoveCommandMenuQueryTextResult {
	queryFound: boolean;
}

export interface RemoveCommandMenuQueryTextParams {
	editorAPI: EditorAPI;
}

export interface HandleBeforeSelectParams {
	editorPort: CommandMenuEditorPort;
	editorAPI: EditorAPI;
}
