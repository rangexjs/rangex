import type { BlockComponent, EditorAPI } from "rich-text-area";
import type { RemoveConfigPort } from "#adapters";

export interface HandleBlockRemoveParams {
	port: RemoveConfigPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockComponent | null;
}
