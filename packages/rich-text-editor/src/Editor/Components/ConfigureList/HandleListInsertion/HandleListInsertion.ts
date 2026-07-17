import {
	createBlockNestedContext,
	createBlockNestedContextLine,
	createBlockNestedContextTextHolder,
	createList,
	listName,
	listRoleSelector,
	nestedEditableName,
	nestedEditableRoleSelector,
} from "rich-text-area";
import { componentsName } from "../../../Constants";
import { createListStorage } from "../ListStorage";
import type {
	CreateListLineParams,
	CreateListLineResult,
	HandleListInsertionParams,
	ListLocalName,
} from "./HandleListInsertion-types";

const createListLine = ({
	localName,
	lineType,
}: CreateListLineParams): CreateListLineResult => {
	const list = createList({ localName, lineType });

	const blockNestedContextLine = createBlockNestedContextLine({
		leftBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
		blockNestedContext: createBlockNestedContext({
			componentName: componentsName.list,
			content: { type: "list" },
			customStorage: createListStorage(),
			childNodes: [list],
		}),
		rightBlockNestedContextTextHolder: createBlockNestedContextTextHolder({}),
	});

	return blockNestedContextLine;
};

export const handleListInsertion = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: HandleListInsertionParams) => {
	const unsubscribe = richTextEditorUI.onNodeInsertion((params) => {
		if (params.type !== "ordered-list" && params.type !== "unordered-list") {
			return;
		}

		const localName: ListLocalName = (
			{
				"ordered-list": "ol",
				"unordered-list": "ul",
			} as const
		)[params.type];

		const listLine = createListLine({
			localName,
			lineType: "multi-line",
		});

		const list = listLine.$$querySelector(listRoleSelector);

		if (list?.$$editorRole !== listName) {
			throw new Error("List's type is invalid.");
		}

		blockComponentPlacement.wrapBySelection({
			blockNestedContextLine: listLine,
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
