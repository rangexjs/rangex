import type { EditorNode } from "@rangex/core";
import type { BlockComponentName } from "#constants";
import type { PlacementScope } from "../BlockComponentPlacement-types";

export interface CanInsertBlockLinesParams {
	fromNode: EditorNode;
	scope: PlacementScope;
	allowedComponents: BlockComponentName[];
}

export type CanInsertBlockLinesResult = boolean;
