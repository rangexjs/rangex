import type { EditorNode } from "rich-text-area";
import type { BlockComponentName } from "../../Constants";
import type { PlacementScope } from "../BlockComponentPlacement-types";

export interface CanInsertBlockLinesParams {
	fromNode: EditorNode;
	scope: PlacementScope;
	allowedComponents: BlockComponentName[];
}

export type CanInsertBlockLinesResult = boolean;
