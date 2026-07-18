import type { BlockNestedContext, EditorAPI } from "rich-text-area";
import type { BlockAlignPort } from "#ports";

export interface HandleBlockAlignStateParams {
	port: BlockAlignPort;
	editorAPI: EditorAPI;
	getCurrentBlock: () => BlockNestedContext | null;
}
