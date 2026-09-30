import type { BlockComponent, EditorNode } from "@rangex/core";
import type { BlockComponentName } from "../../Constants";

export interface GetClosestBlockComponentParams {
	fromNode: EditorNode;
	components?: BlockComponentName[];
}

export type GetClosestBlockComponentResult = BlockComponent | null;
