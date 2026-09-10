import type { EditorAPI, TableCell } from "rich-text-area";
import type { AnchoredOverlayController } from "#engine-links";

export interface PositionToTableCellParams {
	tableCell: TableCell;
	anchorController: AnchoredOverlayController;
}

export interface SyncOverlayVisibilityParams {
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
}

export interface HandleTableContextMenuVisibilityParams {
	editorAPI: EditorAPI;
	anchorController: AnchoredOverlayController;
}
