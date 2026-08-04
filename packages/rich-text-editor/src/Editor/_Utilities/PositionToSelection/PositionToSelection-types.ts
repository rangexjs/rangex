import type { EditorAPI } from "rich-text-area";
import type { AnchoredOverlayController } from "../CreateOverlayController";

export interface PositionPopoverToSelectionParams {
	editorAPI: EditorAPI;
	popover: HTMLElement;
	topMargin: number;
}

export interface PositionToSelectionParams {
	editorAPI: EditorAPI;
	controller: AnchoredOverlayController;
	topMargin: number;
}
