import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createTable as createEngineTable,
} from "@rangex/core";

import { componentsName, tableDefinition } from "#constants";
import { createTableStorage } from "#storage";

import type { CreateTableParams, CreateTableResult } from "./CreateTable-types";

/*
 * Builds a table block component with the given row/column counts, by the tableDefinition.
 */
export const createTable = ({ rows, cols }: CreateTableParams): CreateTableResult => {
	const {
		minColWidth,
		minRowHeight,
		defaultRowHeight,
		tableCellsEditable,
		cellNestedEditableProps,
	} = tableDefinition;

	const table = createEngineTable({
		rows,
		cols,
		minColWidth,
		minRowHeight,
		defaultRowHeight,
		tableCellsEditable,
		cellNestedEditableProps: { ...cellNestedEditableProps },
	});

	return createBlockComponentLine({
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.table,
			content: { type: "custom" },
			customStorage: createTableStorage(),
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			editState: "inherit",
			childNodes: [table],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
