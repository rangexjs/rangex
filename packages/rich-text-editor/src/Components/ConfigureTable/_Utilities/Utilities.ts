import { getClosestTable, getClosestTableCell } from "../../../NodeQuery";
import type {
	GetCommonTableCellFromSelectionParams,
	GetCommonTableCellFromSelectionResult,
	GetCommonTableFromSelectionParams,
	GetCommonTableFromSelectionResult,
} from "./Utilities-types";

/**
 * Returns the TableCell that both selection boundary points share by identity, or null
 * if they are in different cells. The identity check (`===`) is intentional — both
 * endpoints must be inside exactly the same cell for a single-cell action to apply.
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

/**
 * Returns the Table that both selection boundary points share by identity, or null
 * if they are in different tables. The identity check (`===`) is intentional — both
 * endpoints must be inside exactly the same table for a single-table action to apply.
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
