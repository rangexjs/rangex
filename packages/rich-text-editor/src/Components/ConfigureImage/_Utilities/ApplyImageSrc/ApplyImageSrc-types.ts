import type { EditorAPI, HTMLLayout } from "rich-text-area";

export interface ApplyImageSrcParams {
	figure: HTMLLayout;
	src: string;
	editorAPI: EditorAPI;
}
