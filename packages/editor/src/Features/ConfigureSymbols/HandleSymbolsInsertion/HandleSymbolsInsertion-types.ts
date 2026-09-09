import type { EditorAPI } from "rich-text-area";
import type { SymbolsConfigPort } from "#adapters/Symbols";

export interface HandleSymbolsInsertionParams {
	configPort: SymbolsConfigPort;
	editorAPI: EditorAPI;
}
