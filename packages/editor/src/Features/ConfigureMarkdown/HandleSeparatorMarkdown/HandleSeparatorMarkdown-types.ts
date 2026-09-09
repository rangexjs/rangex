import type { EditorAPI } from "rich-text-area";
import type { BlockComponentPlacement } from "#engine-links";

export interface HandleSeparatorMarkdownParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
