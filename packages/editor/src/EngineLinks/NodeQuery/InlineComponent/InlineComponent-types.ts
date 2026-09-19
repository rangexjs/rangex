import type { EditorNode, InlineComponent } from "rich-text-area";
import type { InlineComponentName } from "../../Constants";

export interface GetClosestInlineComponentParams {
	fromNode: EditorNode;
	components?: InlineComponentName[];
}

export type GetClosestInlineComponentResult = InlineComponent | null;
