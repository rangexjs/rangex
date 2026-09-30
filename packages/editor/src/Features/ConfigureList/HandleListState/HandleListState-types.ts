import type { BlockComponent, EditorAPI } from "rich-text-area";
import type { ListConfigPort } from "#adapters/List";

export interface HandleListStateParams {
	configPort: ListConfigPort;
	editorAPI: EditorAPI;
}

export interface GetComponentListParams {
	blockComponent: BlockComponent;
}
