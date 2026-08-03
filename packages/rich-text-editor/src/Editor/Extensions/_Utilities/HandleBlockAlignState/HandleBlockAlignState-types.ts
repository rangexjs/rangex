import type { BlockComponent, EditorAPI } from "rich-text-area";
import type { BlockAlignPort } from "#adapters";

export interface HandleBlockAlignStateParams {
	port: BlockAlignPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockComponent | null;
}
