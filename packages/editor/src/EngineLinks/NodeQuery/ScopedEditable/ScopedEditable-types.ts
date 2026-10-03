import type {
	EditorNode,
	ScopedEditable,
	ScopedEditableDisplay,
} from "@rangex/core";

export interface GetClosestScopedEditableParams {
	fromNode: EditorNode;
	display?: ScopedEditableDisplay;
}

export type GetClosestScopedEditableResult = ScopedEditable | null;

export interface GetClosestCommonScopedEditableParams {
	fromNode: EditorNode;
	toNode: EditorNode;
}

export type GetClosestCommonScopedEditableResult = ScopedEditable | null;
