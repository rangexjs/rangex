import type { EditorAPI } from "rich-text-area";
import type { OnMediaResolveFn } from "../../ConfigureEmptyMedia";

export interface HandleImageInsertionParams {
	editorAPI: EditorAPI;
	onMediaResolve: OnMediaResolveFn;
}
