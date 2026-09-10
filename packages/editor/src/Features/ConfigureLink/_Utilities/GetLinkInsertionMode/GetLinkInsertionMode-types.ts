import type { EditorAPI } from "rich-text-area";

export interface GetLinkInsertionModeParams {
	editorAPI: EditorAPI;
}

export type LinkInsertMode = "insert" | "wrap" | null;

export type GetLinkInsertionModeResult = LinkInsertMode;
