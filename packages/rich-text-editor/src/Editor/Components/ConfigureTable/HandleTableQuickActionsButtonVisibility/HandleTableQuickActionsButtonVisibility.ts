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
	SyncPopoverVisibilityParams,
} from "./HandleTableQuickActionsButtonVisibility-types";

/**
 * Hides the popover unconditionally, then re-shows it anchored to the relevant cell.
 * Multi-cell table selection takes priority — the popover is anchored to `$$focusTableCell`
 * and returns early. If no table selection is active, falls back to the common TableCell
 * of the cursor selection, if one exists.
 */
const syncPopoverVisibility = ({
	popover,
	editorAPI,
}: SyncPopoverVisibilityParams) => {
	const { rootEditable } = editorAPI;

	popover.hidePopover();

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

		popover.showPopover({ source: $$focusTableCell });
		return;
	}

	const tableCell = getCommonTableCellFromSelection({ editorAPI });

	if (tableCell) {
		popover.showPopover({ source: tableCell });
	}
};

/**
 * Subscribes to editor events to keep the quick-actions popover anchored to the
 * relevant TableCell. Three event types drive visibility: `editorSelectionChange`
 * covers a caret or range inside a single cell; `tableSelectionChange` covers
 * multi-cell table selections; `tableStructureChange` keeps the anchor up to date
 * when rows or columns are inserted or deleted.
 */
export const handleTableQuickActionsButtonVisibility = ({
	richTextEditorUI,
	editorAPI,
}: HandleTableQuickActionsButtonVisibilityParams) => {
	const { tableQuickActionsPopover } = richTextEditorUI;
	const { popover } = tableQuickActionsPopover;

	popover.style.positionArea = "center";
	popover.style.left = "100%";

	const unsubscribeSelection = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			syncPopoverVisibility({ popover, editorAPI });
		},
	});

	const unsubscribeTableSelection = editorAPI.subscribeEditorEvent({
		type: tableSelectionChangeEventType,
		callback: () => {
			syncPopoverVisibility({ popover, editorAPI });
		},
	});

	const unsubscribeTableStructure = editorAPI.subscribeEditorEvent({
		type: tableStructureChangeEventType,
		callback: () => {
			syncPopoverVisibility({ popover, editorAPI });
		},
	});

	return () => {
		unsubscribeSelection();
		unsubscribeTableSelection();
		unsubscribeTableStructure();
	};
};
