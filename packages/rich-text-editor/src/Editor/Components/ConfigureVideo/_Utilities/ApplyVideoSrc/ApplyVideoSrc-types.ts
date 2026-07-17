import type { EditorAPI, HTMLLayout } from "rich-text-area";

export interface ApplyVideoSrcParams {
	figure: HTMLLayout;
	src: string;
	editorAPI: EditorAPI;
}
