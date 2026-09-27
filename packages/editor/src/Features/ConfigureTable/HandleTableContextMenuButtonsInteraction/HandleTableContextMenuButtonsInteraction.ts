import {
	nestedEditableRole,
	nestedEditableRoleSelector,
	type TableSectionLocalName,
	tableRole,
	tableRoleSelector,
} from "rich-text-area";
import {
	getCommonTableCellFromSelection,
	getCommonTableFromSelection,
} from "../_Utilities";
import type {
	GetActiveTableCellsParams,
	GetActiveTableCellsResult,
	GetActiveTableParams,
	GetActiveTableResult,
	HandleCellResizingParams,
	HandleCellTypeParams,
	HandleClearContentsParams,
	HandleInsertDeleteParams,
	HandleMergeSplitParams,
	HandleSelectionTypeParams,
	HandleTableContextMenuButtonsInteractionParams,
	HandleVerticalAlignmentParams,
} from "./HandleTableContextMenuButtonsInteraction-types";

/**
 * The "active" table is the one that owns the current selection — either via
 * TableSelection (a table has $$isTableSelectionActive) or EditorSelection
 * (the cursor is inside a table cell). TableSelection takes priority.
 */
const getActiveTable = ({
	editorAPI,
}: GetActiveTableParams): GetActiveTableResult => {
	const { rootEditable } = editorAPI;

	const tables = rootEditable.$$querySelectorAll(tableRoleSelector);

	for (const table of tables) {
		if (table.$$editorRole !== tableRole) {
			throw new Error("Table's type is invalid.");
		}

		if (table.$$isTableSelectionActive) {
			return table;
		}
	}

	return getCommonTableFromSelection({ editorAPI });
};

const handleSelectionType = ({
	configPort,
	editorAPI,
}: HandleSelectionTypeParams) => {
	return configPort.onChangeSectionType((type) => {
		const toSection: TableSectionLocalName = (
			{
				header: "thead",
				body: "tbody",
				footer: "tfoot",
			} as const
		)[type];

		const table = getActiveTable({ editorAPI });

		if (!table) {
			return;
		}

		table.$$moveRowsToSection({
			type: "selection",
			toSection,
			tableCellTagMode: "section",
		});

		editorAPI.focus();
	});
};

const handleMergeSplit = ({
	configPort,
	editorAPI,
}: HandleMergeSplitParams) => {
	return configPort.onChangeMergeSplit((action) => {
		const table = getActiveTable({ editorAPI });

		if (!table) {
			return;
		}

		({
			mergeSelected: () => table.$$mergeCells({ type: "selection" }),
			mergeLeft: () =>
				table.$$mergeCellTo({ type: "selection", direction: "left" }),
			mergeRight: () =>
				table.$$mergeCellTo({ type: "selection", direction: "right" }),
			mergeUp: () =>
				table.$$mergeCellTo({ type: "selection", direction: "up" }),
			mergeDown: () =>
				table.$$mergeCellTo({ type: "selection", direction: "down" }),
			splitHorizontally: () =>
				table.$$splitCell({ type: "selection", direction: "horizontal" }),
			splitVertically: () =>
				table.$$splitCell({ type: "selection", direction: "vertical" }),
			splitFully: () => table.$$splitSpannedCells({ type: "selection" }),
		})[action]();

		editorAPI.focus();
	});
};

const handleInsertDelete = ({
	configPort,
	editorAPI,
}: HandleInsertDeleteParams) => {
	return configPort.onChangeInsertDelete((action) => {
		const table = getActiveTable({ editorAPI });

		if (!table) {
			return;
		}

		({
			insertRowAbove: () =>
				table.$$insertRow({ type: "selection", direction: "up" }),
			insertRowBelow: () =>
				table.$$insertRow({ type: "selection", direction: "down" }),
			insertColumnLeft: () =>
				table.$$insertCol({ type: "selection", direction: "left" }),
			insertColumnRight: () =>
				table.$$insertCol({ type: "selection", direction: "right" }),
			deleteRow: () => table.$$deleteRows({ type: "selection" }),
			deleteColumn: () => table.$$deleteCols({ type: "selection" }),
		})[action]();

		editorAPI.focus();
	});
};

const handleCellType = ({ configPort, editorAPI }: HandleCellTypeParams) => {
	return configPort.onChangeCellType((action) => {
		const table = getActiveTable({ editorAPI });

		if (!table) {
			return;
		}

		({
			header: () =>
				table.$$changeTableCellsLocalName({
					type: "selection",
					toLocalName: "th",
				}),
			data: () =>
				table.$$changeTableCellsLocalName({
					type: "selection",
					toLocalName: "td",
				}),
		})[action]();

		editorAPI.focus();
	});
};

const getActiveTableCells = ({
	editorAPI,
}: GetActiveTableCellsParams): GetActiveTableCellsResult => {
	const table = getActiveTable({ editorAPI });

	if (table?.$$isTableSelectionActive) {
		return table.$$tableCells.filter(
			(tableCell) => tableCell.$$isInMultiSelection,
		);
	}

	const tableCell = getCommonTableCellFromSelection({ editorAPI });

	return tableCell ? [tableCell] : [];
};

const handleVerticalAlignment = ({
	configPort,
	editorAPI,
}: HandleVerticalAlignmentParams) => {
	return configPort.onChangeVerticalAlignment((action) => {
		const tableCells = getActiveTableCells({ editorAPI });

		const alignContent = (
			{
				top: "start",
				middle: "center",
				bottom: "end",
			} as const
		)[action];

		for (const tableCell of tableCells) {
			const nestedEditable = tableCell.$$querySelector(
				nestedEditableRoleSelector,
			);

			if (nestedEditable?.$$editorRole !== nestedEditableRole) {
				throw new Error("NestedEditable's type is invalid.");
			}

			nestedEditable.style.alignContent = alignContent;
		}

		editorAPI.focus();
	});
};

const handleCellResizing = ({
	configPort,
	editorAPI,
}: HandleCellResizingParams) => {
	return configPort.onChangeCellResizing((action) => {
		const table = getActiveTable({ editorAPI });

		if (!table) {
			return;
		}

		const { gridAreaBounds } = table.$$getTableCellsGridArea({
			type: "selection",
		});

		const equalizeColumns = () => {
			const { startColIndex, endColIndex } = gridAreaBounds;
			const colGroups = [...table.$$colGroups];
			const count = endColIndex - startColIndex + 1;
			const totalSelectedWidth = colGroups
				.slice(startColIndex, endColIndex + 1)
				.reduce((sum, w) => sum + w, 0);
			const equalWidth = Math.round(totalSelectedWidth / count);

			for (let i = startColIndex; i <= endColIndex; i++) {
				colGroups[i] = equalWidth;
			}
			/** Last column absorbs the rounding remainder to keep the sum exactly 1000. */
			colGroups[endColIndex] = totalSelectedWidth - equalWidth * (count - 1);

			table.$$resizeCols({ colGroups });
		};

		const minimizeRows = () => {
			const { startRowIndex, endRowIndex } = gridAreaBounds;
			const rowGroups = [...table.$$rowGroups];

			for (let i = startRowIndex; i <= endRowIndex; i++) {
				rowGroups[i] = table.$$defaultRowHeight;
			}

			table.$$resizeRows({ rowGroups });
		};

		({ equalizeColumns, minimizeRows })[action]();

		editorAPI.focus();
	});
};

const handleClearContents = ({
	configPort,
	editorAPI,
}: HandleClearContentsParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	return configPort.onClear(() => {
		const tableCells = getActiveTableCells({ editorAPI });

		for (const tableCell of tableCells) {
			const nestedEditable = tableCell.$$querySelector(
				nestedEditableRoleSelector,
			);

			if (nestedEditable?.$$editorRole !== nestedEditableRole) {
				throw new Error("NestedEditable's type is invalid.");
			}

			/** NestedEditable qualifies as a ContentFlowNode, making it a valid range boundary. */
			editorAPI.removeNodesInRange({
				fromNode: nestedEditable,
				fromOffset: 0,
				toNode: nestedEditable,
				toOffset: nestedEditable.$$childNodes.length,
			});
		}

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	});
};

/*
 * Registers handlers for every table context-menu button action (section type, merge/split,
 * insert/delete, cell type, vertical alignment, cell resizing, clear contents).
 */
export const handleTableContextMenuButtonsInteraction = ({
	configPort,
	editorAPI,
}: HandleTableContextMenuButtonsInteractionParams) => {
	const sectionTypeCleanup = handleSelectionType({
		configPort,
		editorAPI,
	});
	const mergeSplitCleanup = handleMergeSplit({
		configPort,
		editorAPI,
	});
	const insertDeleteCleanup = handleInsertDelete({
		configPort,
		editorAPI,
	});
	const cellTypeCleanup = handleCellType({
		configPort,
		editorAPI,
	});
	const verticalAlignmentCleanup = handleVerticalAlignment({
		configPort,
		editorAPI,
	});
	const cellResizingCleanup = handleCellResizing({
		configPort,
		editorAPI,
	});
	const clearContentsCleanup = handleClearContents({
		configPort,
		editorAPI,
	});

	return () => {
		sectionTypeCleanup();
		mergeSplitCleanup();
		insertDeleteCleanup();
		cellTypeCleanup();
		verticalAlignmentCleanup();
		cellResizingCleanup();
		clearContentsCleanup();
	};
};
