import type { BlockNestedContextLine, EditorAPI } from "rich-text-area";
import type { BlockQuoteEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface CreateBlockQuoteLineResult extends BlockNestedContextLine {}

export interface HandleBlockQuoteInsertionParams {
	editorPort: BlockQuoteEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
