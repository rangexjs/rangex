import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createTable as createEngineTable,
} from "@rangex/core";
import { blockAlignAttr, componentsName } from "#constants";
import { createTableStorage } from "#storage";
import type { CreateTableParams, CreateTableResult } from "./CreateTable-types";

/*
 * Builds a table block component with the given row/column counts.
 */
export const createTable = ({
	rows,
	cols,
}: CreateTableParams): CreateTableResult => {
	const table = createEngineTable({
		rows,
		cols,
		minColWidth: 40,
		minRowHeight: 40,
		defaultRowHeight: 40,
		tableCellsEditable: "true",
		cellNestedEditableProps: {
			allowedComponents: null,
			allowedContentLineLocalNames: null,
			allowedContentLineStyleAttrNames: null,
			allowedGlyphFormatterStyleAttrNames: null,
			allowedGlyphFormatterInlineTags: null,
		},
	});

	return createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
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
