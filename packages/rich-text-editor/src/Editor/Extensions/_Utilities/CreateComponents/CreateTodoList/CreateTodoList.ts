import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createHTMLLayout,
	createList,
} from "rich-text-area";
import { componentsName } from "#ports";
import {
	elementNameAttr,
	todoCheckboxElementName,
} from "../../../../Constants";
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
				domAttrs: {
					type: "checkbox",
					[elementNameAttr]: todoCheckboxElementName,
				},
			}),
			nestedEditable({}),
		],
	});

	return createBlockNestedContextLine({
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.todoList,
			content: { type: "list" },
			childNodes: [list],
		}),
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});
};
