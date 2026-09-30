import type { EditorAPI } from "rich-text-area";

export type OnChangeFn = () => void;

export interface HandleSelectionContextChangeParams {
	editorAPI: EditorAPI;
	onChange: OnChangeFn;
}
