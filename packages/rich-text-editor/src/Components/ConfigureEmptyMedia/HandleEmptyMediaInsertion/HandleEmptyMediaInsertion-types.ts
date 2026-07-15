import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { BlockNestedContextLine, EditorAPI } from "rich-text-area";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface CreateEmptyMediaComponentResult
	extends BlockNestedContextLine {}

export interface HandleEmptyMediaInsertionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
