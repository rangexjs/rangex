import type { EditorAPI } from "rich-text-area";
import type { SymbolsEditorPort } from "#adapters";

export interface ConfigureSymbolsParams {
	editorPort: SymbolsEditorPort;
	editorAPI: EditorAPI;
}
