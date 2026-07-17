import type { BlockNestedContextLine, EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface CreateBlockQuoteLineResult extends BlockNestedContextLine {}

export interface HandleBlockQuoteInsertionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
