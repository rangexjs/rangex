import type { EditorNode, TableCell } from "@rangex/core";

export interface GetClosestTableCellParams {
	fromNode: EditorNode;
}

export type GetClosestTableCellResult = TableCell | null;
