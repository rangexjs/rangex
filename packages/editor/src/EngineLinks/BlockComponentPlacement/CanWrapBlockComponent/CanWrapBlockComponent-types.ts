import type { ContentFlowNode, EditorAPI } from "@rangex/core";
import type { BlockComponentName } from "#constants";
import type { PlacementScope } from "../BlockComponentPlacement-types";

export interface CanWrapBlockComponentParams {
	editorAPI: EditorAPI;
	fromNode: ContentFlowNode;
	fromOffset: number;
	toNode: ContentFlowNode;
	toOffset: number;
	scope: PlacementScope;
	allowedComponents: BlockComponentName[];
}

export type CanWrapBlockComponentResult = boolean;
