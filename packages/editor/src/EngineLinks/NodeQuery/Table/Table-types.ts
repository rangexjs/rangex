import type { EditorNode, Table } from "@rangex/core";

export interface GetClosestTableParams {
	fromNode: EditorNode;
}

export type GetClosestTableResult = Table | null;
