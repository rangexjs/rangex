import { nestedEditableName, nestedEditableRoleSelector } from "rich-text-area";
import { createBlockQuote } from "../../_Utilities";
import type { HandleBlockQuoteInsertionParams } from "./HandleBlockQuoteInsertion-types";

export const handleBlockQuoteInsertion = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleBlockQuoteInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = editorPort.onInsertRequest(() => {
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
		unsubscribe();
	};
};
