import type { EditorNode, InlineComponent } from "rich-text-area";

export interface GetClosestInlineComponentParams {
	fromNode: EditorNode;
	components?: string[];
}

export type GetClosestInlineComponentResult = InlineComponent | null;
