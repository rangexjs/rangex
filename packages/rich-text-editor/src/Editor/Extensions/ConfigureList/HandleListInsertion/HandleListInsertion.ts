import {
	type ListLocalName,
	listName,
	listRoleSelector,
	nestedEditableName,
	nestedEditableRoleSelector,
} from "rich-text-area";
import { createList } from "../../_Utilities";
import type { HandleListInsertionParams } from "./HandleListInsertion-types";

export const handleListInsertion = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleListInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = editorPort.onInsertRequest(({ type }) => {
		const localName: ListLocalName = (
			{
				"ordered-list": "ol",
				"unordered-list": "ul",
			} as const
		)[type];

		const listLine = createList({
			localName,
			lineType: "multi-line",
		});

		const list = listLine.$$querySelector(listRoleSelector);

		if (list?.$$editorRole !== listName) {
			throw new Error("List's type is invalid.");
		}

		blockComponentPlacement.wrapBySelection({
			blockComponentLine: listLine,
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

		snapshotTimeline.registerSnapshotBoundary();

		selection.setBoundaryPoints({
			fromNode: nestedEditable,
			fromOffset: nestedEditable.$$childNodes.length,
			toNode: nestedEditable,
			toOffset: nestedEditable.$$childNodes.length,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
