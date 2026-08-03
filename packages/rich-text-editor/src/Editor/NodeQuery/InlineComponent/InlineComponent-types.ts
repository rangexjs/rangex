import type { EditorNode, InlineComponent } from "rich-text-area";

export interface GetClosestInlineComponentParams {
	fromNode: EditorNode;
	componentName?: string;
}

export type GetClosestInlineComponentResult = InlineComponent | null;
