import type { EditorAPI } from "rich-text-area";
import type { OnMediaResolveFn } from "../../ConfigureEmptyMedia";

export interface HandleEmbedInsertionParams {
	editorAPI: EditorAPI;
	onMediaResolve: OnMediaResolveFn;
}
