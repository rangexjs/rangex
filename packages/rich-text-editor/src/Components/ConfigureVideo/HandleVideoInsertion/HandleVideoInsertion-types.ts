import type { EditorAPI } from "rich-text-area";
import type { OnMediaResolveFn } from "../../ConfigureEmptyMedia";

export interface HandleVideoInsertionParams {
	editorAPI: EditorAPI;
	onMediaResolve: OnMediaResolveFn;
}
