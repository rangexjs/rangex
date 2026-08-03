import type { BlockComponent, EditorAPI } from "rich-text-area";
import type { DeletePort } from "#adapters";

export interface HandleBlockDeleteParams {
	port: DeletePort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockComponent | null;
}
