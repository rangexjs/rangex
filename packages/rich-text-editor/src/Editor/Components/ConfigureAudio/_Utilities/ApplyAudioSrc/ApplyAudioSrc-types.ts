import type { EditorAPI, HTMLLayout } from "rich-text-area";

export interface ApplyAudioSrcParams {
	figure: HTMLLayout;
	src: string;
	editorAPI: EditorAPI;
}
