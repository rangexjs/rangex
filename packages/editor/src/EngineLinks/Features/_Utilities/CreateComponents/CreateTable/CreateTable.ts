import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createTable as createEngineTable,
} from "rich-text-area";
import { componentsName } from "#ports";
import { getCSSText } from "../../../../_Utilities";
import { blockAlignAttr } from "../../../../Constants";
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
