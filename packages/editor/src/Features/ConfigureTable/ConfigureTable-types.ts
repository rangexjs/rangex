import type { EditorAPI } from "rich-text-area";
import type { TableConfigPort } from "#adapters/Table";

export interface ConfigureTableParams {
	configPort: TableConfigPort;
	editorAPI: EditorAPI;
}
