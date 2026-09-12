import type { EditorAPI } from "rich-text-area";

export interface GetLinkPlacementModeParams {
	editorAPI: EditorAPI;
}

export type LinkPlacementMode = "insert" | "wrap" | null;

export type GetLinkPlacementModeResult = LinkPlacementMode;
