import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
	createList,
} from "rich-text-area";
import {
	blockAlignAttr,
	componentsName,
	createTodoCheckboxStorage,
	createTodoListStorage,
	dataPartName,
	todoCheckboxPart,
} from "#engine-links";
import type {
	CreateTodoListParams,
	CreateTodoListResult,
} from "./CreateTodoList-types";

/*
 * Builds a todo list block component: an unordered list whose items each get a checkbox
 * before the editable line content.
 */
export const createTodoList = ({
	childNodes,
}: CreateTodoListParams): CreateTodoListResult => {
	const list = createList({
		localName: "ul",
		lineType: "single-line",
		itemsChildNodes: childNodes?.map((line) => [line]),
		createPreLayout: ({ nestedEditable }) => [
			createHTMLLayout({
				localName: "input",
				customStorage: createTodoCheckboxStorage({ checked: false }),
				domAttrs: {
					type: "checkbox",
					[dataPartName]: todoCheckboxPart.name,
				},
			}),
			nestedEditable({}),
		],
	});

	return createBlockComponentLine({
		domAttrs: {
			[blockAlignAttr.name]: blockAlignAttr.value.center,
		},
		leftBlockComponentTextHolder: createBlockComponentTextHolder({}),
		blockComponent: createBlockComponent({
			componentName: componentsName.todoList,
			content: { type: "list" },
			customStorage: createTodoListStorage(),
			childNodes: [list],
		}),
		rightBlockComponentTextHolder: createBlockComponentTextHolder({}),
	});
};
