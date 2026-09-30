import {
	editorSelectionChangeEventType,
	tableRole,
	tableRoleSelector,
	tableSelectionChangeEventType,
	tableStructureChangeEventType,
} from "rich-text-area";
import { getCommonTableCellFromSelection } from "../_Utilities";
import type {
	HandleTableContextMenuVisibilityParams,
	PositionToTableCellParams,
	SyncOverlayVisibilityParams,
} from "./HandleTableContextMenuVisibility-types";

const positionToTableCell = ({
	tableCell,
	anchorController,
}: PositionToTableCellParams) => {
	anchorController.show(tableCell, {
		clear: true,
		position: "absolute",
		"align-self": "anchor-center",
		right: "anchor(right)",
	});
};

/**
 * Hides the overlay unconditionally, then re-shows it anchored to the relevant cell.
 * Multi-cell table selection takes priority — the overlay is anchored to `$$focusTableCell`
 * and returns early. If no table selection is active, falls back to the common TableCell
 * of the cursor selection, if one exists.
 */
const syncOverlayVisibility = ({
	editorAPI,
	anchorController,
}: SyncOverlayVisibilityParams) => {
	const { rootEditable } = editorAPI;

	anchorController.hide({});

	const tables = rootEditable.$$querySelectorAll(tableRoleSelector);

	for (const table of tables) {
		if (table.$$editorRole !== tableRole) {
			throw new Error("Table's type is invalid.");
		}

		if (!table.$$isTableSelectionActive) {
			continue;
		}

		const { $$focusTableCell } = table;

		if (!$$focusTableCell) {
			throw new Error(
				"FocusTableCell can't be null on table with active selection.",
			);
		}

		positionToTableCell({ tableCell: $$focusTableCell, anchorController });

		return;
	}

	const tableCell = getCommonTableCellFromSelection({ editorAPI });

	if (tableCell) {
		positionToTableCell({ tableCell, anchorController });
	}
};

/*
 * Subscribes to selection and table-structure editor events to keep the context-menu
 * overlay anchored to the relevant TableCell as the selection or table shape changes.
 */
export const handleTableContextMenuVisibility = ({
	editorAPI,
	anchorController,
}: HandleTableContextMenuVisibilityParams) => {
	const unsubscribeSelection = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			syncOverlayVisibility({ editorAPI, anchorController });
		},
	});

	const unsubscribeTableSelection = editorAPI.subscribeEditorEvent({
		type: tableSelectionChangeEventType,
		callback: () => {
			syncOverlayVisibility({ editorAPI, anchorController });
		},
	});

	const unsubscribeTableStructure = editorAPI.subscribeEditorEvent({
		type: tableStructureChangeEventType,
		callback: () => {
			syncOverlayVisibility({ editorAPI, anchorController });
		},
	});

	return () => {
		unsubscribeSelection();
		unsubscribeTableSelection();
		unsubscribeTableStructure();
	};
};
