import type { EditorAPI } from "rich-text-area";

export interface PositionPopoverToSelectionParams {
	editorAPI: EditorAPI;
	popover: HTMLElement;
	topMargin: number;
}
