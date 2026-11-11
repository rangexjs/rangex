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
	componentsName,
	dataPartName,
	todoCheckboxPart,
	todoListDefinition,
} from "#constants";
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
		localName: todoListDefinition.localName,
		lineType: todoListDefinition.lineType,
		editState: todoListDefinition.editState,
		childNodes: childNodes.map((line) =>
			createListItem({
				childNodes: [
					createHTMLLayout({
						localName: "input",
						domAttrs: {
							type: "checkbox",
							[dataPartName]: todoCheckboxPart.name,
						},
						childNodes: [],
					}),
					createNestedEditable({
						...todoListDefinition.itemNestedEditableProps,
						childNodes: [line],
					}),
				],
			}),
		),
	});

	return createBlockComponentLine({
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			name: componentsName.todoList,
			content: { type: "list" },
			customStorage: createTodoListStorage(),
			shouldSelectBeforeRemove: false,
			shouldSelectOnNavigation: false,
			editState: "inherit",
			childNodes: [list],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
