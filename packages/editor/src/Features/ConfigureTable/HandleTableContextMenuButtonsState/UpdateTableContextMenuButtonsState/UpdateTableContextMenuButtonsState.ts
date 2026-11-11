import { nestedEditableRole, nestedEditableRoleSelector } from "@rangex/core";
import { verticalAlignAttr } from "#constants";
import { isScopedEditableEmpty } from "#engine-links";
import {
	getActiveTableCells,
	getCommonTableCellFromSelection,
	getTableCapacity,
} from "../../_Utilities";
import type {
	CellTypeState,
	GetCellTypeButtonsStateParams,
	GetCellTypeButtonsStateResult,
	GetVerticalAlignmentButtonsStateParams,
	IsClearContentsDisabledParams,
	IsClearContentsDisabledResult,
	IsTableCellEmptyParams,
	IsTableCellEmptyResult,
	UpdateTableContextMenuButtonsStateParams,
	VerticalAlignmentState,
} from "./UpdateTableContextMenuButtonsState-types";

/**
 * Returns the first message whose corresponding validity flag is false, or undefined
 * when all checks pass. Used to surface the most-specific reason a button is disabled.
 */
const resolveInfo = (checks: [boolean, string][]) =>
	checks.find(([isValid]) => !isValid)?.[1];

/**
 * Both header and data can be true at the same time when the active selection contains
 * a mix of `<th>` and `<td>` cells — the UI reflects the actual state of each cell
 * rather than enforcing a single-choice model.
 */
const getCellTypeButtonsState = ({
	editorAPI,
	table,
}: GetCellTypeButtonsStateParams): GetCellTypeButtonsStateResult => {
	const activeTableCells = getActiveTableCells({ editorAPI, table });

	const cellTypeState: CellTypeState = { header: false, data: false };

	for (const tableCell of activeTableCells) {
		const { $$localName } = tableCell;

		cellTypeState.header ||= $$localName === "th";
		cellTypeState.data ||= $$localName === "td";
	}

	return cellTypeState;
};

const getVerticalAlignmentButtonsState = ({
	editorAPI,
	table,
}: GetVerticalAlignmentButtonsStateParams) => {
	const activeTableCells = getActiveTableCells({ editorAPI, table });

	const verticalAlignmentState: VerticalAlignmentState = {
		start: false,
		center: false,
		end: false,
	};

	for (const tableCell of activeTableCells) {
		const nestedEditable = tableCell.$$querySelector(
			nestedEditableRoleSelector,
		);

		if (nestedEditable?.$$editorRole !== nestedEditableRole) {
			throw new Error("nestedEditable's type is invalid.");
		}

		const verticalAlign = nestedEditable.getAttribute(verticalAlignAttr.name);

		// Without the attribute, the cell is top-aligned
		verticalAlignmentState.start ||=
			verticalAlign === null || verticalAlign === verticalAlignAttr.value.start;
		verticalAlignmentState.center ||=
			verticalAlign === verticalAlignAttr.value.center;
		verticalAlignmentState.end ||=
			verticalAlign === verticalAlignAttr.value.end;
	}

	return verticalAlignmentState;
};

const isTableCellEmpty = ({
	tableCell,
}: IsTableCellEmptyParams): IsTableCellEmptyResult => {
	const nestedEditable = tableCell.$$querySelector(nestedEditableRoleSelector);

	if (nestedEditable?.$$editorRole !== nestedEditableRole) {
		throw new Error("NestedEditable's type is invalid.");
	}

	const isEmpty = isScopedEditableEmpty({ scopedEditable: nestedEditable });

	return isEmpty;
};

const isClearContentsDisabled = ({
	editorAPI,
	table,
}: IsClearContentsDisabledParams): IsClearContentsDisabledResult => {
	const activeTableCells = getActiveTableCells({ editorAPI, table });

	const everyCellEmpty = activeTableCells.every((tableCell) =>
		isTableCellEmpty({ tableCell }),
	);

	return everyCellEmpty;
};

export const updateTableContextMenuButtonsState = ({
	configPort,
	editorAPI,
	table,
}: UpdateTableContextMenuButtonsStateParams) => {
	const mergeCellsValidityState = table.$$checkMergeCells({
		type: "selection",
	});
	const { mergeLeft, mergeRight, mergeUp, mergeDown } =
		table.$$checkMergeCellTo({ type: "selection" });
	const splitValidityState = table.$$checkSplitCell({ type: "selection" });
	const splitSpannedValidityState = table.$$checkSplitSpannedCells({
		type: "selection",
	});
	const moveRowsToSectionValidityState = table.$$checkMoveRowsToSection({
		type: "selection",
	});
	const insertRowValidityState = table.$$checkInsertRow({ type: "selection" });
	const insertColValidityState = table.$$checkInsertCol({ type: "selection" });
	const deleteRowsValidityState = table.$$checkDeleteRows({
		type: "selection",
	});
	const deleteColsValidityState = table.$$checkDeleteCols({
		type: "selection",
	});

	const { limits } = configPort;

	const tableCapacity = getTableCapacity({
		table,
		tableCell: getCommonTableCellFromSelection({ editorAPI }),
		limits,
	});

	const maxRowsInfo = `A table can have at most ${limits.maxRows} rows.`;
	const maxColsInfo = `A table can have at most ${limits.maxCols} columns.`;

	const insertRowInfo = resolveInfo([
		[
			insertRowValidityState.canInsert,
			"A row cannot be inserted in the current selection.",
		],
		[tableCapacity.canAddRow, maxRowsInfo],
	]);

	const insertColInfo = resolveInfo([
		[
			insertColValidityState.canInsert,
			"A column cannot be inserted in the current selection.",
		],
		[tableCapacity.canAddCol, maxColsInfo],
	]);

	const mergeCellsInfo = resolveInfo([
		[
			mergeCellsValidityState.hasMultipleCells,
			"Multiple cells have to be selected.",
		],
		[
			mergeCellsValidityState.isSameSection,
			"Selected cells are in different sections.",
		],
	]);

	const mergeLeftInfo = resolveInfo([
		[mergeLeft.hasSingleCell, "A single cell must be selected."],
		[mergeLeft.hasNeighbor, "There is no cell to the left."],
		[
			mergeLeft.isColSpanAligned,
			"The cell and its left neighbor must have matching row spans.",
		],
	]);

	const mergeRightInfo = resolveInfo([
		[mergeRight.hasSingleCell, "A single cell must be selected."],
		[mergeRight.hasNeighbor, "There is no cell to the right."],
		[
			mergeRight.isColSpanAligned,
			"The cell and its right neighbor must have matching row spans.",
		],
	]);

	const mergeUpInfo = resolveInfo([
		[mergeUp.hasSingleCell, "A single cell must be selected."],
		[mergeUp.hasNeighbor, "There is no cell above."],
		[
			mergeUp.isRowSpanAligned,
			"The cell and its upper neighbor must have matching column spans.",
		],
		[mergeUp.isSameSection, "The cells are in different table sections."],
	]);

	const mergeDownInfo = resolveInfo([
		[mergeDown.hasSingleCell, "A single cell must be selected."],
		[mergeDown.hasNeighbor, "There is no cell below."],
		[
			mergeDown.isRowSpanAligned,
			"The cell and its lower neighbor must have matching column spans.",
		],
		[mergeDown.isSameSection, "The cells are in different table sections."],
	]);

	const splitHorizontallyInfo = resolveInfo([
		[
			splitValidityState.horizontal.hasSingleCell,
			"A single cell must be selected.",
		],
		[tableCapacity.canSplitHorizontally, maxColsInfo],
	]);

	const splitVerticallyInfo = resolveInfo([
		[
			splitValidityState.vertical.hasSingleCell,
			"A single cell must be selected.",
		],
		[tableCapacity.canSplitVertically, maxRowsInfo],
	]);

	const splitFullyInfo = resolveInfo([
		[
			splitSpannedValidityState.isSpanned,
			"None of the selected cells are spanned.",
		],
	]);

	const cellTypeState = getCellTypeButtonsState({ editorAPI, table });

	const verticalAlignmentState = getVerticalAlignmentButtonsState({
		editorAPI,
		table,
	});

	const clearContentsDisabled = isClearContentsDisabled({ editorAPI, table });

	configPort.updateState({
		sectionType: {
			header: {
				disabled: !moveRowsToSectionValidityState.canMoveToHead,
				info: "Selected cells are already in the header section.",
			},
			body: {
				disabled: !moveRowsToSectionValidityState.canMoveToBody,
				info: "Selected cells are already in the body section.",
			},
			footer: {
				disabled: !moveRowsToSectionValidityState.canMoveToFoot,
				info: "Selected cells are already in the footer section.",
			},
		},
		mergeSplit: {
			mergeSelected: {
				disabled: !mergeCellsValidityState.canMerge,
				info: mergeCellsInfo,
			},
			mergeLeft: { disabled: !mergeLeft.canMerge, info: mergeLeftInfo },
			mergeRight: { disabled: !mergeRight.canMerge, info: mergeRightInfo },
			mergeUp: { disabled: !mergeUp.canMerge, info: mergeUpInfo },
			mergeDown: { disabled: !mergeDown.canMerge, info: mergeDownInfo },
			splitHorizontally: {
				disabled: !(
					splitValidityState.horizontal.canSplit &&
					tableCapacity.canSplitHorizontally
				),
				info: splitHorizontallyInfo,
			},
			splitVertically: {
				disabled: !(
					splitValidityState.vertical.canSplit &&
					tableCapacity.canSplitVertically
				),
				info: splitVerticallyInfo,
			},
			splitFully: {
				disabled: !splitSpannedValidityState.canSplit,
				info: splitFullyInfo,
			},
		},
		insertDelete: {
			insertRowAbove: {
				disabled: !(
					insertRowValidityState.canInsert && tableCapacity.canAddRow
				),
				info: insertRowInfo,
			},
			insertRowBelow: {
				disabled: !(
					insertRowValidityState.canInsert && tableCapacity.canAddRow
				),
				info: insertRowInfo,
			},
			insertColumnLeft: {
				disabled: !(
					insertColValidityState.canInsert && tableCapacity.canAddCol
				),
				info: insertColInfo,
			},
			insertColumnRight: {
				disabled: !(
					insertColValidityState.canInsert && tableCapacity.canAddCol
				),
				info: insertColInfo,
			},
			deleteRow: {
				disabled: !deleteRowsValidityState.canDelete,
				info: "The selected rows cannot be deleted.",
			},
			deleteColumn: {
				disabled: !deleteColsValidityState.canDelete,
				info: "The selected columns cannot be deleted.",
			},
		},
		cellType: {
			header: { disabled: false, checked: cellTypeState.header },
			data: { disabled: false, checked: cellTypeState.data },
		},
		verticalAlignment: {
			start: { disabled: false, checked: verticalAlignmentState.start },
			center: { disabled: false, checked: verticalAlignmentState.center },
			end: { disabled: false, checked: verticalAlignmentState.end },
		},
		cellResizing: {
			equalizeColumns: { disabled: false },
			minimizeRows: { disabled: false },
		},
		clearContents: { disabled: clearContentsDisabled },
	});
};
