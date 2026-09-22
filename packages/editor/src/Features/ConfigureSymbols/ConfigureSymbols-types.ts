import type { EditorAPI } from "rich-text-area";
import type { SymbolsConfigPort } from "#adapters/Symbols";

export interface ConfigureSymbolsParams {
	configPort: SymbolsConfigPort;
	editorAPI: EditorAPI;
}
