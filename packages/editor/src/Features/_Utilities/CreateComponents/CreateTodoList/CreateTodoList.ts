import {
	createBeamText,
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createContentLine,
	createHTMLLayout,
	createList,
	createListItem,
	createNestedEditable,
} from "@rangex/core";
import {
	blockAlignAttr,
	componentsName,
	dataPartName,
	todoCheckboxPart,
} from "#engine-links";
import { createTodoListStorage } from "#storage";
import type {
	CreateTodoListParams,
	CreateTodoListResult,
} from "./CreateTodoList-types";

/*
 * Builds a todo list block component: an unordered list with one item per given child line
 * (or a single empty one), each getting a checkbox before the editable line content.
 */
export const createTodoList = ({
	childNodes = [
		createContentLine({ localName: "p", childNodes: [createBeamText({})] }),
	],
}: CreateTodoListParams): CreateTodoListResult => {
	const list = createList({
		localName: "ul",
		lineType: "single-line",
		childNodes: childNodes.map((line) =>
			createListItem({
				childNodes: [
					createHTMLLayout({
						localName: "input",
						domAttrs: {
							type: "checkbox",
							[dataPartName]: todoCheckboxPart.name,
						},
					}),
					createNestedEditable({
						display: "block single-line",
						editState: "inherit",
						childNodes: [line],
					}),
				],
			}),
		),
	});

	return createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.todoList,
			content: { type: "list" },
			customStorage: createTodoListStorage(),
			childNodes: [list],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
