import type { BlockComponent, EditorNode } from "rich-text-area";

export interface GetClosestBlockComponentParams {
	fromNode: EditorNode;
	componentName?: string;
}

export type GetClosestBlockComponentResult = BlockComponent | null;
