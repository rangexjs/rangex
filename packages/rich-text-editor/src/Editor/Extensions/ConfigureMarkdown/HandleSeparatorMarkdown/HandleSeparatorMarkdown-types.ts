import type { EditorAPI } from "rich-text-area";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleSeparatorMarkdownParams {
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
