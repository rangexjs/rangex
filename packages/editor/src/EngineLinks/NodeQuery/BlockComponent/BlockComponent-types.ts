import type { BlockComponent, EditorNode } from "rich-text-area";

export interface GetClosestBlockComponentParams {
	fromNode: EditorNode;
	components?: string[];
}

export type GetClosestBlockComponentResult = BlockComponent | null;
