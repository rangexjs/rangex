import type { EditorAPI } from "rich-text-area";
import type { SymbolsEditorPort } from "#adapters";

export interface HandleSymbolsInsertionParams {
	editorPort: SymbolsEditorPort;
	editorAPI: EditorAPI;
}
