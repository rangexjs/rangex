import type { EditorAPI } from "@rangex/core";

import type { BlockComponentPlacement } from "#engine-links";

export interface HandleSeparatorMarkdownParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
