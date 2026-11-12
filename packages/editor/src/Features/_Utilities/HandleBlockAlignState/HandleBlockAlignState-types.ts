import type { BlockComponent, EditorAPI } from "@rangex/core";

import type { BlockAlignConfigPort, CurrentComponentConfigPort } from "#adapters";

export interface HandleBlockAlignStateParams {
	port: BlockAlignConfigPort & CurrentComponentConfigPort<BlockComponent>;
	editorAPI: EditorAPI;
}
