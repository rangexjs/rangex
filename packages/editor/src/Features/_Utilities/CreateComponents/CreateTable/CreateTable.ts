import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createTable as createEngineTable,
} from "rich-text-area";
import {
	blockAlignAttr,
	componentsName,
	createTableStorage,
	getCSSText,
} from "#engine-links";
import type { CreateTableParams, CreateTableResult } from "./CreateTable-types";

/*
 * Builds a table block component with the given row/column counts, applying a default
 * border style to both the table and its cells.
 */
export const createTable = ({
	rows,
	cols,
}: CreateTableParams): CreateTableResult => {
	const table = createEngineTable({
		rows,
		cols,
		domAttrs: {
			style: getCSSText({
				borderWidth: "1px",
				borderStyle: "solid",
				borderColor: "grey",
			}),
		},
		cellDOMAttrs: {
			style: getCSSText({
				borderWidth: "1px",
				borderStyle: "solid",
				borderColor: "grey",
			}),
		},
	});

	return createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			componentName: componentsName.table,
			content: { type: "custom" },
			customStorage: createTableStorage(),
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			childNodes: [table],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
