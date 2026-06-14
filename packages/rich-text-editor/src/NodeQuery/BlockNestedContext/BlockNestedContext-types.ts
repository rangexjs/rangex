import type { BlockNestedContext, EditorNode } from "rich-text-area";

export interface GetClosestBlockNestedContextParams {
	fromNode: EditorNode;
	componentName?: string;
}

export type GetClosestBlockNestedContextResult = BlockNestedContext | null;
