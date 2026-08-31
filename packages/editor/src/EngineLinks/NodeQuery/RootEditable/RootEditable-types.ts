import type {
	EditorNode,
	RootEditable,
	RootEditableDisplay,
} from "rich-text-area";

export interface GetClosestRootEditableParams {
	fromNode: EditorNode;
	display?: RootEditableDisplay;
}

export type GetClosestRootEditableResult = RootEditable | null;
