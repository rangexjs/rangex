import type { EditorAPI } from "rich-text-area";

export interface HandleImageDropParams {
	editorAPI: EditorAPI;
}

export interface IsImageDropzoneParams {
	element: Element;
}
