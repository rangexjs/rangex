import type { EditorAPI, Table, TableCell } from "@rangex/core";

export interface GetCommonTableCellFromSelectionParams {
	editorAPI: EditorAPI;
}

export type GetCommonTableCellFromSelectionResult = TableCell | null;

export interface GetCommonTableFromSelectionParams {
	editorAPI: EditorAPI;
}

export type GetCommonTableFromSelectionResult = Table | null;
