import type { EditorAPI } from "rich-text-area";

export type LinkInsertionMode = "insert" | "wrap" | null;

export interface GetLinkInsertionModeParams {
	editorAPI: EditorAPI;
}

export type GetLinkInsertionModeResult = LinkInsertionMode;
