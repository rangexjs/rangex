import type { EditorNode } from "rich-text-area";

export interface CanInsertBlockLinesParams {
	fromNode: EditorNode;
	allowedComponents: string[];
}

export type CanInsertBlockLinesResult = boolean;
