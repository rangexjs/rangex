import type { LinkPopoverState } from "@rangex/rich-text-editor-ui";
import type { EditorAPI, InlineNestedContext } from "rich-text-area";

export interface GetPopoverStateFromLinkParams {
	editorAPI: EditorAPI;
	link: InlineNestedContext;
}

export interface GetPopoverStateFromLinkResult extends LinkPopoverState {}
