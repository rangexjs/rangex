import type { ContentFlowNode, EditorAPI } from "rich-text-area";

export interface CanWrapBlockComponentParams {
	editorAPI: EditorAPI;
	fromNode: ContentFlowNode;
	fromOffset: number;
	toNode: ContentFlowNode;
	toOffset: number;
	allowedComponents: string[];
}

export type CanWrapBlockComponentResult = boolean;
