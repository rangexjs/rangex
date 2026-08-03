import type { EditorAPI, InlineComponent } from "rich-text-area";
import type { LinkState } from "#adapters";

export interface GetStateFromLinkParams {
	editorAPI: EditorAPI;
	link: InlineComponent;
}

export interface GetStateFromLinkResult extends LinkState {}
