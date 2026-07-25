import type {
	BlockNestedContextLine,
	EditorAPI,
	ListLineType,
	ListLocalName,
} from "rich-text-area";
import type { ListEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface CreateListLineParams {
	localName: ListLocalName;
	lineType: ListLineType;
}

export interface CreateListLineResult extends BlockNestedContextLine {}

export interface HandleListInsertionParams {
	editorPort: ListEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
