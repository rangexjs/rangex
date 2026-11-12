import type { BlockComponent, EditorAPI } from "@rangex/core";

import type { CurrentComponentConfigPort, SwapToSourcePlaceholderConfigPort } from "#adapters";

export interface HandleSwapToSourcePlaceholderParams {
	port: SwapToSourcePlaceholderConfigPort & CurrentComponentConfigPort<BlockComponent>;
	editorAPI: EditorAPI;
}
