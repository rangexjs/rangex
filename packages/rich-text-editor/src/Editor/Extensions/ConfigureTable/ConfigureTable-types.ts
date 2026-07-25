import type { EditorAPI } from "rich-text-area";
import type { TableEditorPort } from "#adapters";

export interface ConfigureTableParams {
	editorPort: TableEditorPort;
	editorAPI: EditorAPI;
}
