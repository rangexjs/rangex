import type { EditorAPI, InlineNestedContext } from "rich-text-area";
import type { LinkState } from "#adapters";

export interface GetStateFromLinkParams {
	editorAPI: EditorAPI;
	link: InlineNestedContext;
}

export interface GetStateFromLinkResult extends LinkState {}
