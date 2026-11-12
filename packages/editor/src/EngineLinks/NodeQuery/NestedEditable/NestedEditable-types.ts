import type { EditorNode, NestedEditable, NestedEditableDisplay } from "@rangex/core";

export interface GetClosestNestedEditableParams {
	fromNode: EditorNode;
	display?: NestedEditableDisplay;
}

export type GetClosestNestedEditableResult = NestedEditable | null;
