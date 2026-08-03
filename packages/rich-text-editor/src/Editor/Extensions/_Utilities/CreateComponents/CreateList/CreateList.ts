import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createList as createEngineList,
} from "rich-text-area";
import { componentsName } from "#ports";
import { createListStorage } from "../../../../Storage";
import type { CreateListParams, CreateListResult } from "./CreateList-types";

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
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			componentName: componentsName.list,
			content: { type: "list" },
			customStorage: createListStorage(),
			childNodes: [list],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
