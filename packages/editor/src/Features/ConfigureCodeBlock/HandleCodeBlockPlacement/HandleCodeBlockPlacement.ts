import {
	createBeamText,
	createContentLine,
	listRole,
	listRoleSelector,
	nestedEditableRole,
	nestedEditableRoleSelector,
} from "@rangex/core";

import { createCodeBlock, validateCodeBlockPlacement } from "../../_Utilities";
import type { HandleCodeBlockPlacementParams } from "./HandleCodeBlockPlacement-types";

/*
 * Handles inserting and wrapping code block components by selection, placing the caret
 * inside the newly created line and registering a snapshot boundary. An invalid language or theme
 * is ignored. Returns a cleanup function.
 */
export const handleCodeBlockPlacement = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleCodeBlockPlacementParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribeInsert = configPort.onInsert(({ language, theme }) => {
		const placementMismatch = validateCodeBlockPlacement({ language, theme });

		if (placementMismatch) {
			console.warn(placementMismatch);
			return;
		}

		const codeBlockLine = createCodeBlock({
			language,
			theme,
			childNodes: [createContentLine({ localName: "p", childNodes: [createBeamText({})] })],
		});

		blockComponentPlacement.insertBySelection({
			lines: [codeBlockLine],
			shouldReplaceContentLineIfEmpty: true,
		});

		const list = codeBlockLine.$$querySelector(listRoleSelector);

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

	const unsubscribeWrap = configPort.onWrap(({ language, theme }) => {
		const placementMismatch = validateCodeBlockPlacement({ language, theme });

		if (placementMismatch) {
			console.warn(placementMismatch);
			return;
		}

		const codeBlockLine = createCodeBlock({ language, theme });

		const list = codeBlockLine.$$querySelector(listRoleSelector);

		if (list?.$$editorRole !== listRole) {
			throw new Error("List's type is invalid.");
		}

		blockComponentPlacement.wrapBySelection({
			blockComponentLine: codeBlockLine,
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
