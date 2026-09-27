import {
	createBeamText,
	createContentLine,
	listRole,
	listRoleSelector,
	nestedEditableRole,
	nestedEditableRoleSelector,
} from "rich-text-area";
import { createList } from "../../_Utilities";
import type { HandleListPlacementParams } from "./HandleListPlacement-types";

/*
 * Listens for insert and wrap requests and creates a list of the requested type at the current
 * selection, placing the caret inside its last item. Returns a cleanup function for both listeners.
 */
export const handleListPlacement = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleListPlacementParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribeInsert = configPort.onInsert(({ localName }) => {
		const listLine = createList({
			localName,
			lineType: "multi-line",
			childNodes: [
				createContentLine({ localName: "p", childNodes: [createBeamText({})] }),
			],
		});

		blockComponentPlacement.insertBySelection({
			lines: [listLine],
			shouldReplaceContentLineIfEmpty: true,
		});

		const list = listLine.$$querySelector(listRoleSelector);

		if (list?.$$editorRole !== listRole) {
			throw new Error("List's type is invalid.");
		}

		const lastListItem = list.$$children.at(-1);

		if (!lastListItem) {
			throw new Error("LastListItem can't be undefined.");
		}

		const nestedEditable = lastListItem.$$querySelector(
			nestedEditableRoleSelector,
		);

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

	const unsubscribeWrap = configPort.onWrap(({ localName }) => {
		const listLine = createList({ localName, lineType: "multi-line" });

		const list = listLine.$$querySelector(listRoleSelector);

		if (list?.$$editorRole !== listRole) {
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
