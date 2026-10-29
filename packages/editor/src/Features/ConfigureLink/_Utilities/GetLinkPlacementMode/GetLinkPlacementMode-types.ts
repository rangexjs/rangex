import type { EditorAPI, GetInlineWrappableSegmentsResult } from "@rangex/core";

export interface GetLinkPlacementModeParams {
	editorAPI: EditorAPI;
}

export interface InsertLinkPlacementMode {
	type: "insert";
}

export interface WrapLinkPlacementMode {
	type: "wrap";
	segments: GetInlineWrappableSegmentsResult;
}

export type LinkPlacementMode =
	| InsertLinkPlacementMode
	| WrapLinkPlacementMode
	| null;

export type GetLinkPlacementModeResult = LinkPlacementMode;
