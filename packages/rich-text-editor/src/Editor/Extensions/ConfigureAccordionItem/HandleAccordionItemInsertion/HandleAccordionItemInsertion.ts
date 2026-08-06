import { createAccordionItem } from "../../_Utilities";
import type { HandleAccordionItemInsertionParams } from "./HandleAccordionItemInsertion-types";

export const handleAccordionItemInsertion = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleAccordionItemInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = editorPort.onInsertRequest(() => {
		const { blockComponentLine, summaryNestedEditable } = createAccordionItem(
			{},
		);

		blockComponentPlacement.insertBySelection({
			lines: [blockComponentLine],
			shouldReplaceContentLineIfEmpty: true,
		});

		snapshotTimeline.registerSnapshotBoundary();

		selection.setBoundaryPoints({
			fromNode: summaryNestedEditable,
			fromOffset: 0,
			toNode: summaryNestedEditable,
			toOffset: 0,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
