import {
	editorSelectionChangeEventType,
	tableName,
	tableRoleSelector,
	tableSelectionChangeEventType,
	tableStructureChangeEventType,
} from "rich-text-area";
import { getCommonTableCellFromSelection } from "../_Utilities";
import type {
	HandleTableQuickActionsButtonVisibilityParams,
	PositionToTableCellParams,
	SyncOverlayVisibilityParams,
} from "./HandleTableQuickActionsButtonVisibility-types";

const positionToTableCell = ({
	tableCell,
	anchorController,
}: PositionToTableCellParams) => {
	// CSS hack in order to anchor to the center of the TableCell's border-box
	const width = 20;

	const popover = anchorController.element.querySelector("[popover]");

	if (!(popover instanceof HTMLElement)) {
		throw new Error("Element supposed to contain a popover.");
	}

	popover.style.setProperty("transition", "none");
	// Forces reflow so the open (and animated) popovers disappear immediately
	popover.offsetHeight;

	anchorController.show(tableCell, {
		clear: true,
		position: "absolute",
		"align-self": "anchor-center",
		width: `${width}px`,
		right: `calc(anchor(right) - ${width / 2}px)`,
	});

	popover.style.removeProperty("transition");
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

	anchorController.hide();

	const tables = rootEditable.$$querySelectorAll(tableRoleSelector);

	for (const table of tables) {
		if (table.$$editorRole !== tableName) {
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

/**
 * Subscribes to editor events to keep the quick-actions overlay anchored to the
 * relevant TableCell. Three event types drive visibility: `editorSelectionChange`
 * covers a caret or range inside a single cell; `tableSelectionChange` covers
 * multi-cell table selections; `tableStructureChange` keeps the anchor up to date
 * when rows or columns are inserted or deleted.
 */
export const handleTableQuickActionsButtonVisibility = ({
	editorAPI,
	anchorController,
}: HandleTableQuickActionsButtonVisibilityParams) => {
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
