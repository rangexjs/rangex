import type { EditorNode, Line } from "@rangex/core";

export interface ReplaceContentLineIfNeededParams {
	blockLevelLine: Line;
	lines: Line[];
	shouldReplaceContentLineIfEmpty?: boolean;
}

export interface ReplaceContentLineIfNeededResult {
	updatedLine: Line;
	updatedLines: Line[];
}

export interface InsertBlockLinesParams {
	fromNode: EditorNode;
	lines: Line[];
	shouldReplaceContentLineIfEmpty: boolean;
}
