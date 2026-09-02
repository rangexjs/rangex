import type { BlockComponent, EditorAPI } from "rich-text-area";
import type { RemovePort } from "#adapters";

export interface HandleBlockRemoveParams {
	port: RemovePort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockComponent | null;
}
