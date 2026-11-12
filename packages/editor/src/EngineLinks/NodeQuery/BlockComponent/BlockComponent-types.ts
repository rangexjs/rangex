import type { BlockComponent, EditorNode } from "@rangex/core";

import type { BlockComponentName } from "#constants";

export interface GetClosestBlockComponentParams {
	fromNode: EditorNode;
	components?: BlockComponentName[];
}

export type GetClosestBlockComponentResult = BlockComponent | null;
