import type { EditorNode } from "rich-text-area";
import type { BlockComponentName } from "../../Constants";

export interface CanInsertBlockLinesParams {
	fromNode: EditorNode;
	allowedComponents: BlockComponentName[];
}

export type CanInsertBlockLinesResult = boolean;
