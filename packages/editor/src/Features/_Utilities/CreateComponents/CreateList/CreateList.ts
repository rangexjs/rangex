import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createList as createEngineList,
} from "rich-text-area";
import {
	blockAlignAttr,
	componentsName,
	createListStorage,
} from "#engine-links";
import type { CreateListParams, CreateListResult } from "./CreateList-types";

/*
 * Builds a list block component (ordered/unordered) whose items are populated from the
 * given child lines, or left empty when none are provided.
 */
export const createList = ({
	localName,
	lineType,
	childNodes,
}: CreateListParams): CreateListResult => {
	const list = createEngineList({
		localName,
		lineType,
		itemsChildNodes: childNodes?.map((line) => [line]),
	});

	return createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.list,
			content: { type: "list" },
			customStorage: createListStorage(),
			childNodes: [list],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
