import type { EditorAPI, HTMLLayout } from "rich-text-area";

export interface ApplyEmbedSrcParams {
	figure: HTMLLayout;
	src: string;
	editorAPI: EditorAPI;
}
