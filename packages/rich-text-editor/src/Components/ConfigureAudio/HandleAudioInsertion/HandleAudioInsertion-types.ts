import type { EditorAPI } from "rich-text-area";
import type { OnMediaResolveFn } from "../../ConfigureEmptyMedia";

export interface HandleAudioInsertionParams {
	editorAPI: EditorAPI;
	onMediaResolve: OnMediaResolveFn;
}
