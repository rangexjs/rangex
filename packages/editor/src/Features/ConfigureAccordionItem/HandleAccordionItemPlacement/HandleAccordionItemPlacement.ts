import { createAccordionItem } from "../../_Utilities";
import type { HandleAccordionItemPlacementParams } from "./HandleAccordionItemPlacement-types";

/*
 * Handles inserting and wrapping accordion item components by selection, placing the caret
 * inside the newly created editable and registering a snapshot boundary. Returns a cleanup function.
 */
export const handleAccordionItemPlacement = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleAccordionItemPlacementParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribeInsert = configPort.onInsert(() => {
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

	const unsubscribeWrap = configPort.onWrap(() => {
		const { blockComponentLine, bodyNestedEditable } = createAccordionItem({
			childNodes: [],
		});

		blockComponentPlacement.wrapBySelection({
			blockComponentLine,
			target: bodyNestedEditable,
		});

		snapshotTimeline.registerSnapshotBoundary();

		selection.setBoundaryPoints({
			fromNode: bodyNestedEditable,
			fromOffset: bodyNestedEditable.$$childNodes.length,
			toNode: bodyNestedEditable,
			toOffset: bodyNestedEditable.$$childNodes.length,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribeInsert();
		unsubscribeWrap();
	};
};
