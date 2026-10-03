import { isEditorElement, tableRole, tableRoleSelector } from "@rangex/core";
import type {
	GetClosestTableParams,
	GetClosestTableResult,
} from "./Table-types";

export const getClosestTable = ({
	fromNode,
}: GetClosestTableParams): GetClosestTableResult => {
	const element = isEditorElement(fromNode)
		? fromNode
		: fromNode.$$parentElement;

	if (!element) {
		return null;
	}

	const table = element.$$closest(tableRoleSelector);

	if (!table) {
		return null;
	}

	if (table.$$editorRole !== tableRole) {
		throw new Error("Table's type is invalid.");
	}

	return table;
};
