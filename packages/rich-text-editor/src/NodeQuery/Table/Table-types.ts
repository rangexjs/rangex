import type { EditorNode, Table } from "rich-text-area";

export interface GetClosestTableParams {
	fromNode: EditorNode;
}

export type GetClosestTableResult = Table | null;
