import {
	createBeamText,
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createContentLine,
	createList as createEngineList,
	createListItem,
	createNestedEditable,
} from "@rangex/core";

import { componentsName, listDefinition } from "#constants";
import { createListStorage } from "#storage";

import type { CreateListParams, CreateListResult } from "./CreateList-types";

/*
 * Builds a list block component (ordered/unordered, by the listDefinition) with one item per given child line,
 * or a single empty item when none are provided.
 */
export const createList = ({
	localName,
	childNodes = [createContentLine({ localName: "p", childNodes: [createBeamText({})] })],
}: CreateListParams): CreateListResult => {
	const list = createEngineList({
		localName,
		lineType: listDefinition.lineType,
		editState: listDefinition.editState,
		childNodes: childNodes.map((line) =>
			createListItem({
				childNodes: [
					createNestedEditable({
						...listDefinition.itemNestedEditableProps,
						childNodes: [line],
					}),
				],
			}),
		),
	});

	return createBlockComponentLine({
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.list,
			content: { type: "list" },
			customStorage: createListStorage(),
			shouldSelectBeforeRemove: false,
			shouldSelectOnNavigation: false,
			editState: "inherit",
			childNodes: [list],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
