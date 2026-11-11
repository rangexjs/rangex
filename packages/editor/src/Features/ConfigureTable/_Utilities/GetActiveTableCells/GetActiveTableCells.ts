import { getCommonTableCellFromSelection } from "../GetCommonTable";
import type {
	GetActiveTableCellsParams,
	GetActiveTableCellsResult,
} from "./GetActiveTableCells-types";

/*
 * Returns the cells the table actions apply to: the multi-selected cells while the table has
 * an active TableSelection, otherwise the cell holding the EditorSelection, if any.
 */
export const getActiveTableCells = ({
	editorAPI,
	table,
}: GetActiveTableCellsParams): GetActiveTableCellsResult => {
	if (table.$$isTableSelectionActive) {
		return table.$$tableCells.filter(
			(tableCell) => tableCell.$$isInMultiSelection,
		);
	}

	const tableCell = getCommonTableCellFromSelection({ editorAPI });

	if (tableCell) {
		return [tableCell];
	}

	return [];
};
