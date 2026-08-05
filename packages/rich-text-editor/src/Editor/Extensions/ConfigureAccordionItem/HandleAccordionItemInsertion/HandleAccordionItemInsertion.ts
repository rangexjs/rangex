import { createBeamText, createContentLine } from "rich-text-area";
import { createAccordionItem } from "../../_Utilities";
import type { HandleAccordionItemInsertionParams } from "./HandleAccordionItemInsertion-types";

export const handleAccordionItemInsertion = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleAccordionItemInsertionParams) => {
	const unsubscribe = editorPort.onInsertRequest(() => {
		const { blockComponentLine, summaryNestedEditable } = createAccordionItem(
			{},
		);

		const trailingLine = createContentLine({
			localName: "p",
			childNodes: [createBeamText({})],
		});

		blockComponentPlacement.insertBySelection({
			lines: [blockComponentLine, trailingLine],
			shouldReplaceContentLineIfEmpty: true,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		const selection = editorAPI.getEditorSelection();

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
