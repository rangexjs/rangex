import type { EditorAPI } from "@rangex/core";

import type { OverlayController } from "../CreateOverlayController";

export interface PositionToSelectionParams {
	editorAPI: EditorAPI;
	controller: OverlayController;
	topMargin: number;
}
