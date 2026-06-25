import {
	nestedEditableName,
	nestedEditableRoleSelector,
	type TableSectionLocalName,
	tableName,
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
	HandleTableQuickActionsButtonsInteractionParams,
	HandleVerticalAlignmentParams,
} from "./HandleTableQuickActionsButtonsInteraction-types";

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
		if (table.$$editorRole !== tableName) {
			throw new Error("Table's type is invalid.");
		}

		if (table.$$isTableSelectionActive) {
			return table;
		}
	}

	return getCommonTableFromSelection({ editorAPI });
};

const handleSelectionType = ({
	tableQuickActionsPopover,
	editorAPI,
}: HandleSelectionTypeParams) => {
	return tableQuickActionsPopover.onSectionType((type) => {
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
	tableQuickActionsPopover,
	editorAPI,
}: HandleMergeSplitParams) => {
	return tableQuickActionsPopover.onMergeSplit((action) => {
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
	tableQuickActionsPopover,
	editorAPI,
}: HandleInsertDeleteParams) => {
	return tableQuickActionsPopover.onInsertDelete((action) => {
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

const handleCellType = ({
	tableQuickActionsPopover,
	editorAPI,
}: HandleCellTypeParams) => {
	return tableQuickActionsPopover.onCellType((action) => {
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
	tableQuickActionsPopover,
	editorAPI,
}: HandleVerticalAlignmentParams) => {
	return tableQuickActionsPopover.onVerticalAlignment((action) => {
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

			if (nestedEditable?.$$editorRole !== nestedEditableName) {
				throw new Error("NestedEditable's type is invalid.");
			}

			nestedEditable.style.alignContent = alignContent;
		}

		editorAPI.focus();
	});
};

const handleCellResizing = ({
	tableQuickActionsPopover,
	editorAPI,
}: HandleCellResizingParams) => {
	return tableQuickActionsPopover.onCellResizing((action) => {
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
	tableQuickActionsPopover,
	editorAPI,
}: HandleClearContentsParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	return tableQuickActionsPopover.onClearContents(() => {
		const tableCells = getActiveTableCells({ editorAPI });

		for (const tableCell of tableCells) {
			const nestedEditable = tableCell.$$querySelector(
				nestedEditableRoleSelector,
			);

			if (nestedEditable?.$$editorRole !== nestedEditableName) {
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

export const handleTableQuickActionsButtonsInteraction = ({
	richTextEditorUI,
	editorAPI,
}: HandleTableQuickActionsButtonsInteractionParams) => {
	const { tableQuickActionsPopover } = richTextEditorUI;

	const sectionTypeCleanup = handleSelectionType({
		tableQuickActionsPopover,
		editorAPI,
	});
	const mergeSplitCleanup = handleMergeSplit({
		tableQuickActionsPopover,
		editorAPI,
	});
	const insertDeleteCleanup = handleInsertDelete({
		tableQuickActionsPopover,
		editorAPI,
	});
	const cellTypeCleanup = handleCellType({
		tableQuickActionsPopover,
		editorAPI,
	});
	const verticalAlignmentCleanup = handleVerticalAlignment({
		tableQuickActionsPopover,
		editorAPI,
	});
	const cellResizingCleanup = handleCellResizing({
		tableQuickActionsPopover,
		editorAPI,
	});
	const clearContentsCleanup = handleClearContents({
		tableQuickActionsPopover,
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
