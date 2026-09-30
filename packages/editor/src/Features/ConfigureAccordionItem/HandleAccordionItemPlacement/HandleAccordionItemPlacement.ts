import { createAccordionItem, getAccordionItemParts } from "../../_Utilities";
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
		const accordionItemLine = createAccordionItem({ open: true });
		const { summaryNestedEditable } = getAccordionItemParts({
			accordionItem: accordionItemLine,
		});

		blockComponentPlacement.insertBySelection({
			lines: [accordionItemLine],
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
		const accordionItemLine = createAccordionItem({
			open: true,
			childNodes: [],
		});
		const { bodyNestedEditable } = getAccordionItemParts({
			accordionItem: accordionItemLine,
		});

		blockComponentPlacement.wrapBySelection({
			blockComponentLine: accordionItemLine,
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
