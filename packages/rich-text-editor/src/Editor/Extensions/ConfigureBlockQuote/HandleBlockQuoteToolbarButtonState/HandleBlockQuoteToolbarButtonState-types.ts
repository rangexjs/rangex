import type { EditorAPI } from "rich-text-area";
import type { BlockQuoteEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface HandleBlockQuoteToolbarButtonStateParams {
	editorPort: BlockQuoteEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
