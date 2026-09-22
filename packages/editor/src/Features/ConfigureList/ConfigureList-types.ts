import type { EditorAPI } from "rich-text-area";
import type { ListConfigPort } from "#adapters/List";

export interface ConfigureListParams {
	configPort: ListConfigPort;
	editorAPI: EditorAPI;
}
