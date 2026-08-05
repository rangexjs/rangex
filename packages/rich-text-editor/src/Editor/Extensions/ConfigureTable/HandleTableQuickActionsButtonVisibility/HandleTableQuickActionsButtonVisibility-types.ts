import type { EditorAPI, TableCell } from "rich-text-area";
import type { AnchoredOverlayController } from "../../../_Utilities";

export interface PositionToTableCellParams {
	tableCell: TableCell;
	anchorController: AnchoredOverlayController;
}

export interface SyncOverlayVisibilityParams {
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
}

export interface HandleTableQuickActionsButtonVisibilityParams {
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
}
