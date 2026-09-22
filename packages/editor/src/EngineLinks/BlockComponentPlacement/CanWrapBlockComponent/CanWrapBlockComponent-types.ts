import type { ContentFlowNode, EditorAPI } from "rich-text-area";
import type { BlockComponentName } from "../../Constants";

export interface CanWrapBlockComponentParams {
	editorAPI: EditorAPI;
	fromNode: ContentFlowNode;
	fromOffset: number;
	toNode: ContentFlowNode;
	toOffset: number;
	allowedComponents: BlockComponentName[];
}

export type CanWrapBlockComponentResult = boolean;
