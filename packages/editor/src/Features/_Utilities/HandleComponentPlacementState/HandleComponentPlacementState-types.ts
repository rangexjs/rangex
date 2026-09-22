import type { EditorAPI } from "rich-text-area";

export type UpdateStateFn = () => void;

export interface HandleComponentPlacementStateParams {
	editorAPI: EditorAPI;
	updateState: UpdateStateFn;
}
