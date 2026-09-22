import type { EditorAPI, EditorText } from "rich-text-area";

export interface GetSelectionForwardTextParams {
	editorAPI: EditorAPI;
}

export type GetSelectionForwardTextResult = EditorText;
