import type { BlockNestedContextLine, EditorAPI } from "rich-text-area";
import type { TableEditorPort } from "#adapters";
import type { BlockComponentPlacement } from "../../../BlockComponentPlacement";

export interface CreateTableComponentParams {
	rows: number;
	cols: number;
}

export interface CreateTableComponentResult extends BlockNestedContextLine {}

export interface HandleTableInsertionParams {
	editorPort: TableEditorPort;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
