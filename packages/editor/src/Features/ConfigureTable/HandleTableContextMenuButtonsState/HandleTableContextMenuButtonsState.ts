import {
	editorSelectionChangeEventType,
	snapshotIndexChangeEventType,
	tableSelectionChangeEventType,
	tableStructureChangeEventType,
} from "@rangex/core";
import { getCommonTableCellFromSelection } from "../_Utilities";
import type { HandleTableContextMenuButtonsStateParams } from "./HandleTableContextMenuButtonsState-types";
import { updateTableContextMenuButtonsState } from "./UpdateTableContextMenuButtonsState";

/*
 * Subscribes to selection, table-structure and snapshot-index editor events to keep the
 * context-menu button states (disabled/checked, with reasons) in sync with the active table
 * selection.
 *
 * Changes that fire no editor event of their own (vertical alignment, clear contents, undo/redo)
 * are picked up through snapshot-index-change. This assumes every such change registers a
 * snapshot; a change that doesn't, or a snapshot push cancelled in snapshot-before-add, leaves
 * the state stale until the next event.
 */
export const handleTableContextMenuButtonsState = ({
	configPort,
	editorAPI,
}: HandleTableContextMenuButtonsStateParams) => {
	const unsubscribeSelection = editorAPI.subscribeEditorEvent({
		type: editorSelectionChangeEventType,
		callback: () => {
			const tableCell = getCommonTableCellFromSelection({ editorAPI });

			if (!tableCell) {
				return;
			}

			const { $$table } = tableCell;

			if (!$$table) {
				throw new Error("Table can't be null.");
			}

			/** When table selection is active, state is updated via tableSelectionChangeEventType instead. */
			if ($$table.$$isTableSelectionActive) {
				return;
			}

			updateTableContextMenuButtonsState({
				configPort,
				editorAPI,
				table: $$table,
			});
		},
	});

	const unsubscribeTableSelection = editorAPI.subscribeEditorEvent({
		type: tableSelectionChangeEventType,
		callback: ({ tables }) => {
			const tableCell = getCommonTableCellFromSelection({ editorAPI });

			if (!tableCell) {
				return;
			}

			const { $$table } = tableCell;

			if (!$$table) {
				throw new Error("Table can't be null.");
			}

			if (!tables.has($$table)) {
				return;
			}

			updateTableContextMenuButtonsState({
				configPort,
				editorAPI,
				table: $$table,
			});
		},
	});

	const unsubscribeTableStructure = editorAPI.subscribeEditorEvent({
		type: tableStructureChangeEventType,
		callback: ({ tables }) => {
			const tableCell = getCommonTableCellFromSelection({ editorAPI });

			if (!tableCell) {
				return;
			}

			const { $$table } = tableCell;

			if (!$$table) {
				throw new Error("Table can't be null.");
			}

			if (!tables.has($$table)) {
				return;
			}

			updateTableContextMenuButtonsState({
				configPort,
				editorAPI,
				table: $$table,
			});
		},
	});

	const unsubscribeSnapshotIndex = editorAPI.subscribeEditorEvent({
		type: snapshotIndexChangeEventType,
		callback: () => {
			const tableCell = getCommonTableCellFromSelection({ editorAPI });

			if (!tableCell) {
				return;
			}

			const { $$table } = tableCell;

			if (!$$table) {
				throw new Error("Table can't be null.");
			}

			updateTableContextMenuButtonsState({
				configPort,
				editorAPI,
				table: $$table,
			});
		},
	});

	return () => {
		unsubscribeSelection();
		unsubscribeTableSelection();
		unsubscribeTableStructure();
		unsubscribeSnapshotIndex();
	};
};
