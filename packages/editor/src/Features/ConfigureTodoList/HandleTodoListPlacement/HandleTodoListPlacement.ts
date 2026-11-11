import {
	createBeamText,
	createContentLine,
	listRole,
	listRoleSelector,
	nestedEditableRole,
	nestedEditableRoleSelector,
} from "@rangex/core";

import { createTodoList } from "../../_Utilities";
import type { HandleTodoListPlacementParams } from "./HandleTodoListPlacement-types";

/*
 * Handles inserting and wrapping todo list components by selection, placing the caret
 * inside the newly created line and registering a snapshot boundary. Returns a cleanup function.
 */
export const handleTodoListPlacement = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleTodoListPlacementParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribeInsert = configPort.onInsert(() => {
		const todoListLine = createTodoList({
			childNodes: [createContentLine({ localName: "p", childNodes: [createBeamText({})] })],
		});

		blockComponentPlacement.insertBySelection({
			lines: [todoListLine],
			shouldReplaceContentLineIfEmpty: true,
		});

		const list = todoListLine.$$querySelector(listRoleSelector);

		if (list?.$$editorRole !== listRole) {
			throw new Error("List's type is invalid.");
		}

		const lastListItem = list.$$children.at(-1);

		if (!lastListItem) {
			throw new Error("LastListItem can't be undefined.");
		}

		const nestedEditable = lastListItem.$$querySelector(nestedEditableRoleSelector);

		if (nestedEditable?.$$editorRole !== nestedEditableRole) {
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

	const unsubscribeWrap = configPort.onWrap(() => {
		const todoListLine = createTodoList({});

		const list = todoListLine.$$querySelector(listRoleSelector);

		if (list?.$$editorRole !== listRole) {
			throw new Error("List's type is invalid.");
		}

		blockComponentPlacement.wrapBySelection({
			blockComponentLine: todoListLine,
			target: list,
		});

		const lastListItem = list.$$children.at(-1);

		if (!lastListItem) {
			throw new Error("LastListItem can't be undefined.");
		}

		const nestedEditable = lastListItem.$$querySelector(nestedEditableRoleSelector);

		if (nestedEditable?.$$editorRole !== nestedEditableRole) {
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
		unsubscribeInsert();
		unsubscribeWrap();
	};
};
