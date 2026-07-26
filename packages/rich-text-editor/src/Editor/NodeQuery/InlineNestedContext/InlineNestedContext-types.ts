import type { EditorNode, InlineNestedContext } from "rich-text-area";

export interface GetClosestInlineNestedContextParams {
	fromNode: EditorNode;
	componentName?: string;
}

export type GetClosestInlineNestedContextResult = InlineNestedContext | null;
