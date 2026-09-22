import type { BlockComponent, EditorAPI } from "rich-text-area";
import type { SwapToEmptyMediaConfigPort } from "#adapters";

export interface HandleSwapToEmptyMediaParams {
	port: SwapToEmptyMediaConfigPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockComponent | null;
}
