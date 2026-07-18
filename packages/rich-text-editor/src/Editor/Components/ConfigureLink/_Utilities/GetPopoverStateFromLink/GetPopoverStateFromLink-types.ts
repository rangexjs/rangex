import type { EditorAPI, InlineNestedContext } from "rich-text-area";
import type { LinkPopoverState } from "#ports";

export interface GetPopoverStateFromLinkParams {
	editorAPI: EditorAPI;
	link: InlineNestedContext;
}

export interface GetPopoverStateFromLinkResult extends LinkPopoverState {}
