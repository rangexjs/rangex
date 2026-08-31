import type {
	EditorNode,
	ScopedEditable,
	ScopedEditableDisplay,
} from "rich-text-area";

export interface GetClosestScopedEditableParams {
	fromNode: EditorNode;
	display?: ScopedEditableDisplay;
}

export type GetClosestScopedEditableResult = ScopedEditable | null;
