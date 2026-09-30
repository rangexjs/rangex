import type { EditorNode, Line } from "@rangex/core";

export interface GetClosestBlockLevelLineParams {
	fromNode: EditorNode;
}

export type GetClosestBlockLevelLineResult = Line | null;
