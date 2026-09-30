import type { EditorAPI } from "@rangex/core";

export interface GetLinkPlacementModeParams {
	editorAPI: EditorAPI;
}

export type LinkPlacementMode = "insert" | "wrap" | null;

export type GetLinkPlacementModeResult = LinkPlacementMode;
