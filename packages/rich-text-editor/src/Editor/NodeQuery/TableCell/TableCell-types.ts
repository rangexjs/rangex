import type { EditorNode, TableCell } from "rich-text-area";

export interface GetClosestTableCellParams {
	fromNode: EditorNode;
}

export type GetClosestTableCellResult = TableCell | null;
