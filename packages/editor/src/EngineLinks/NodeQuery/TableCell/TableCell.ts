import {
	isEditorElement,
	tableCellName,
	tableCellRoleSelector,
} from "rich-text-area";
import type {
	GetClosestTableCellParams,
	GetClosestTableCellResult,
} from "./TableCell-types";

export const getClosestTableCell = ({
	fromNode,
}: GetClosestTableCellParams): GetClosestTableCellResult => {
	const element = isEditorElement(fromNode)
		? fromNode
		: fromNode.$$parentElement;

	if (!element) {
		return null;
	}

	const tableCell = element.$$closest(tableCellRoleSelector);

	if (!tableCell) {
		return null;
	}

	if (tableCell.$$editorRole !== tableCellName) {
		throw new Error("TableCell's type is invalid.");
	}

	return tableCell;
};
