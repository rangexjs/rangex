import {
	createBlockComponent,
	createBlockComponentLine,
	createBlockComponentTextHolder,
	createHTMLLayout,
	createList,
} from "rich-text-area";
import { componentsName, dataPartName, todoCheckboxPart } from "#ports";
import {
	createTodoCheckboxStorage,
	createTodoListStorage,
} from "../../../../Storage";
import type {
	CreateTodoListParams,
	CreateTodoListResult,
} from "./CreateTodoList-types";

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
