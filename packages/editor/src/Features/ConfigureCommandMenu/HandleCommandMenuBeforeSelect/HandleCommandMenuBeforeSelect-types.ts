import type { EditorAPI } from "rich-text-area";
import type { CommandMenuConfigPort } from "#adapters/CommandMenu";

export interface HandleCommandMenuBeforeSelectParams {
	configPort: CommandMenuConfigPort;
	editorAPI: EditorAPI;
}

export interface RemoveCommandMenuQueryTextParams {
	editorAPI: EditorAPI;
}

export interface RemoveCommandMenuQueryTextResult {
	queryFound: boolean;
}
