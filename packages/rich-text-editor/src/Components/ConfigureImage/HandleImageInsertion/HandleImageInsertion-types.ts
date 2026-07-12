import type { RichTextEditorUI } from "@rangex/rich-text-editor-ui";
import type { BlockNestedContextLine, EditorAPI } from "rich-text-area";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface CreateImageComponentResult extends BlockNestedContextLine {}

export interface HandleImageInsertionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
