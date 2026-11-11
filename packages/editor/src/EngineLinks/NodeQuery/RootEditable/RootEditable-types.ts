import type { EditorNode, RootEditable, RootEditableDisplay } from "@rangex/core";

export interface GetClosestRootEditableParams {
	fromNode: EditorNode;
	display?: RootEditableDisplay;
}

export type GetClosestRootEditableResult = RootEditable | null;
