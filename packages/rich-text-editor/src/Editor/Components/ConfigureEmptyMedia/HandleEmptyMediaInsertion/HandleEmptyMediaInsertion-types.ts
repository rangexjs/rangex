import type { BlockNestedContextLine, EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface CreateEmptyMediaComponentResult
	extends BlockNestedContextLine {}

export interface HandleEmptyMediaInsertionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
