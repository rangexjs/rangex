import type { EditorAPI } from "@rangex/core";
import type { SymbolsConfigPort } from "#adapters/Symbols";

export interface HandleSymbolsInsertionParams {
	configPort: SymbolsConfigPort;
	editorAPI: EditorAPI;
}
