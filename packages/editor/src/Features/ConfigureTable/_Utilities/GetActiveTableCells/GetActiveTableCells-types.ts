import type { EditorAPI, Table, TableCell } from "@rangex/core";

export interface GetActiveTableCellsParams {
	editorAPI: EditorAPI;
	table: Table;
}

export type GetActiveTableCellsResult = TableCell[];
