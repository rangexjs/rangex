import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createHTMLLayout,
	createList,
	listName,
	listRoleSelector,
	nestedEditableName,
	nestedEditableRoleSelector,
} from "rich-text-area";
import {
	componentsName,
	elementNameAttr,
	todoCheckboxElementName,
} from "../../../Constants";
import type {
	CreateTodoListLineResult,
	HandleTodoListInsertionParams,
} from "./HandleTodoListInsertion-types";

const createTodoListLine = (): CreateTodoListLineResult => {
	const list = createList({
		localName: "ul",
		lineType: "single-line",
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

	const blockNestedContextLine = createBlockNestedContextLine({
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.todoList,
			content: { type: "list" },
			childNodes: [list],
		}),
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});

	return blockNestedContextLine;
};

export const handleTodoListInsertion = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleTodoListInsertionParams) => {
	const unsubscribe = editorPort.onInsertRequest(() => {
		const todoListLine = createTodoListLine();

		const list = todoListLine.$$querySelector(listRoleSelector);

		if (list?.$$editorRole !== listName) {
			throw new Error("List's type is invalid.");
		}

		blockComponentPlacement.wrapBySelection({
			blockNestedContextLine: todoListLine,
			target: list,
		});

		const lastListItem = list.$$children.at(-1);

		if (!lastListItem) {
			throw new Error("LastListItem can't be undefined.");
		}

		const nestedEditable = lastListItem.$$querySelector(
			nestedEditableRoleSelector,
		);

		if (nestedEditable?.$$editorRole !== nestedEditableName) {
			throw new Error("NestedEditable's type is invalid.");
		}

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		const selection = editorAPI.getEditorSelection();

		selection.setBoundaryPoints({
			fromNode: nestedEditable,
			fromOffset: nestedEditable.childNodes.length,
			toNode: nestedEditable,
			toOffset: nestedEditable.childNodes.length,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
