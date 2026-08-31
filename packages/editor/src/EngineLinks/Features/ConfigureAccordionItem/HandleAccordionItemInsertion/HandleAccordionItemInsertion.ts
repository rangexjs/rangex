import { createAccordionItem } from "../../_Utilities";
import type { HandleAccordionItemInsertionParams } from "./HandleAccordionItemInsertion-types";

// TODO: Rename to ...Placement
export const handleAccordionItemInsertion = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleAccordionItemInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = configPort.onInsert(() => {
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

	// TODO: Add .onWrap

	return () => {
		unsubscribe();
	};
};
