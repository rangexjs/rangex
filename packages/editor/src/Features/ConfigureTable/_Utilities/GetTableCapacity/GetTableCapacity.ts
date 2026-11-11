import type { GetTableCapacityParams, GetTableCapacityResult } from "./GetTableCapacity-types";

/*
 * Whether the table can grow by a row or a column within its limits. Splitting the given cell only adds one when it
 * isn't spanned, otherwise it only shrinks its span.
 */
export const getTableCapacity = ({
	table,
	tableCell,
	limits,
}: GetTableCapacityParams): GetTableCapacityResult => {
	const canAddRow = table.$$rowGroups.length < limits.maxRows;
	const canAddCol = table.$$colGroups.length < limits.maxCols;

	if (!(tableCell instanceof HTMLTableCellElement)) {
		return {
			canAddRow,
			canAddCol,
			canSplitHorizontally: canAddCol,
			canSplitVertically: canAddRow,
		};
	}

	return {
		canAddRow,
		canAddCol,
		canSplitHorizontally: canAddCol || tableCell.colSpan > 1,
		canSplitVertically: canAddRow || tableCell.rowSpan > 1,
	};
};
