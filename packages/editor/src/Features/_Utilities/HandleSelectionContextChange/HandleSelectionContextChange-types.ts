import type { EditorAPI } from "@rangex/core";

export type OnChangeFn = () => void;

export interface HandleSelectionContextChangeParams {
	editorAPI: EditorAPI;
	onChange: OnChangeFn;
}
