import type { BlockComponent, EditorNode } from "rich-text-area";
import type { BlockComponentName } from "../../Constants";

export interface GetClosestBlockComponentParams {
	fromNode: EditorNode;
	components?: BlockComponentName[];
}

export type GetClosestBlockComponentResult = BlockComponent | null;
