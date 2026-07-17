import type { BlockNestedContextLine, EditorAPI } from "rich-text-area";
import type { RichTextEditorUI } from "#ui";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface CreateTodoListLineResult extends BlockNestedContextLine {}

export interface HandleTodoListInsertionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
