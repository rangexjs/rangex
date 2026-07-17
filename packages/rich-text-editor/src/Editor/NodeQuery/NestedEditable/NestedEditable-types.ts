import type {
	EditorNode,
	NestedEditable,
	NestedEditableDisplay,
} from "rich-text-area";

export interface GetClosestNestedEditableParams {
	fromNode: EditorNode;
	display?: NestedEditableDisplay;
}

export type GetClosestNestedEditableResult = NestedEditable | null;
