import type { EditorAPI, EditorText } from "@rangex/core";

export interface GetSelectionForwardTextParams {
	editorAPI: EditorAPI;
}

export type GetSelectionForwardTextResult = EditorText;
