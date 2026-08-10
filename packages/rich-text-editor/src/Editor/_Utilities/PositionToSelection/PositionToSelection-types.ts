import type { EditorAPI } from "rich-text-area";
import type { OverlayController } from "../CreateOverlayController";

export interface PositionToSelectionParams {
	editorAPI: EditorAPI;
	controller: OverlayController;
	topMargin: number;
}
