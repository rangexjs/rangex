import type {
	BlockNestedContextLine,
	EditorAPI,
	ListLineType,
} from "rich-text-area";
import type { RichTextEditorUI } from "#ui";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export type ListLocalName = "ol" | "ul";

export interface CreateListLineParams {
	localName: ListLocalName;
	lineType: ListLineType;
}

export interface CreateListLineResult extends BlockNestedContextLine {}

export interface HandleListInsertionParams {
	richTextEditorUI: RichTextEditorUI;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
