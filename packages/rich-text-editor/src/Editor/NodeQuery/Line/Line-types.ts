import type { EditorNode, Line } from "rich-text-area";

export interface GetClosestBlockLevelLineParams {
	fromNode: EditorNode;
}

export type GetClosestBlockLevelLineResult = Line | null;
