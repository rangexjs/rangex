import {
	createBeamText,
	createContentLine,
	nestedEditableName,
	nestedEditableRoleSelector,
} from "rich-text-area";
import { createBlockQuote } from "../../_Utilities";
import type { HandleBlockQuotePlacementParams } from "./HandleBlockQuotePlacement-types";

export const handleBlockQuotePlacement = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleBlockQuotePlacementParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribeInsert = configPort.onInsert(() => {
		const blockQuoteLine = createBlockQuote({
			childNodes: [
				createContentLine({ localName: "p", childNodes: [createBeamText({})] }),
			],
		});

		blockComponentPlacement.insertBySelection({
			lines: [blockQuoteLine],
			shouldReplaceContentLineIfEmpty: true,
		});

		const nestedEditable = blockQuoteLine.$$querySelector(
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

	const unsubscribeWrap = configPort.onWrap(() => {
		const blockQuoteLine = createBlockQuote({});

		const nestedEditable = blockQuoteLine.$$querySelector(
			nestedEditableRoleSelector,
		);

		if (nestedEditable?.$$editorRole !== nestedEditableName) {
			throw new Error("NestedEditable's type is invalid.");
		}

		blockComponentPlacement.wrapBySelection({
			blockComponentLine: blockQuoteLine,
			target: nestedEditable,
		});

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
