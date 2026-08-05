import type { EditorAPI } from "rich-text-area";
import type { AnchoredOverlayController } from "../../../_Utilities";

export interface CloseOnSelectionChangeParams {
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
}

export interface CloseOnEditorBlurParams {
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
}

export interface RestoreFocusOnEscapeParams {
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
}

export interface HandleTemplateVariableOverlayCloseParams {
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
}
