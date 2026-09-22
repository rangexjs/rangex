import type {
	ContentLine,
	ContentLineDisplay,
	EditorNode,
} from "rich-text-area";

export interface GetClosestContentLineParams {
	fromNode: EditorNode;
	display?: ContentLineDisplay;
}

export type GetClosestContentLineResult = ContentLine | null;
