import { getClosestTable, getClosestTableCell } from "#engine-links";
import type {
	GetCommonTableCellFromSelectionParams,
	GetCommonTableCellFromSelectionResult,
	GetCommonTableFromSelectionParams,
	GetCommonTableFromSelectionResult,
} from "./GetCommonTable-types";

/*
 * Returns the TableCell that both selection boundary points share by identity, or null
 * if they are in different cells.
 */
export const getCommonTableCellFromSelection = ({
	editorAPI,
}: GetCommonTableCellFromSelectionParams): GetCommonTableCellFromSelectionResult => {
	const selection = editorAPI.getEditorSelection();

	const { fromText, toText } = selection.getBoundaryPoints();

	const fromTableCell = getClosestTableCell({ fromNode: fromText });
	const toTableCell = getClosestTableCell({ fromNode: toText });

	const hasSameTableCell = !!(
		fromTableCell &&
		toTableCell &&
		fromTableCell === toTableCell
	);

	return hasSameTableCell ? fromTableCell : null;
};

/*
 * Returns the Table that both selection boundary points share by identity, or null
 * if they are in different tables.
 */
export const getCommonTableFromSelection = ({
	editorAPI,
}: GetCommonTableFromSelectionParams): GetCommonTableFromSelectionResult => {
	const selection = editorAPI.getEditorSelection();

	const { fromText, toText } = selection.getBoundaryPoints();

	const fromTable = getClosestTable({ fromNode: fromText });
	const toTable = getClosestTable({ fromNode: toText });

	const hasSameTable = !!(fromTable && toTable && fromTable === toTable);

	return hasSameTable ? fromTable : null;
};
