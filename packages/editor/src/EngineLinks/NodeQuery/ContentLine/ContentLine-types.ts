import type { ContentLine, ContentLineDisplay, EditorNode } from "@rangex/core";

export interface GetClosestContentLineParams {
	fromNode: EditorNode;
	display?: ContentLineDisplay;
}

export type GetClosestContentLineResult = ContentLine | null;
