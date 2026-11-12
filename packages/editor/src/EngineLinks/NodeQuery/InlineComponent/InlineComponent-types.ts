import type { EditorNode, InlineComponent } from "@rangex/core";

import type { InlineComponentName } from "#constants";

export interface GetClosestInlineComponentParams {
	fromNode: EditorNode;
	components?: InlineComponentName[];
}

export type GetClosestInlineComponentResult = InlineComponent | null;
