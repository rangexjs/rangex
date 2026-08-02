import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createTable as createEngineTable,
} from "rich-text-area";
import { componentsName } from "#ports";
import { getCSSText } from "../../../../_Utilities";
import { createTableStorage } from "../../../../Storage";
import type { CreateTableParams, CreateTableResult } from "./CreateTable-types";

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

	return createBlockNestedContextLine({
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.table,
			content: { type: "custom" },
			customStorage: createTableStorage(),
			shouldSelectOnNavigation: true,
			shouldSelectBeforeRemove: true,
			childNodes: [table],
		}),
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});
};
