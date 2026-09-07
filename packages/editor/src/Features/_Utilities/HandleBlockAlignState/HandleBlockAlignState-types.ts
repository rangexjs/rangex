import type { BlockComponent, EditorAPI } from "rich-text-area";
import type { BlockAlignConfigPort } from "#adapters";

export interface HandleBlockAlignStateParams {
	port: BlockAlignConfigPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockComponent | null;
}
