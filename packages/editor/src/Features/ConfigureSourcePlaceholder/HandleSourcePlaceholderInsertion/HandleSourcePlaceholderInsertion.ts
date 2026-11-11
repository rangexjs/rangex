import { createSourcePlaceholder } from "../../_Utilities";
import type { HandleSourcePlaceholderInsertionParams } from "./HandleSourcePlaceholderInsertion-types";

/*
 * Handles inserting and swapping in an source placeholder placeholder by selection, placing the caret
 * after it and registering a snapshot boundary. Returns a cleanup function.
 */
export const handleSourcePlaceholderInsertion = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleSourcePlaceholderInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const insertSourcePlaceholder = () => {
		const sourcePlaceholderLine = createSourcePlaceholder();

		blockComponentPlacement.insertBySelection({
			lines: [sourcePlaceholderLine],
			shouldReplaceContentLineIfEmpty: true,
		});

		snapshotTimeline.registerSnapshotBoundary();

		selection.setBoundaryPoints({
			fromNode: sourcePlaceholderLine,
			fromOffset: sourcePlaceholderLine.$$childNodes.length,
			toNode: sourcePlaceholderLine,
			toOffset: sourcePlaceholderLine.$$childNodes.length,
		});

		editorAPI.focus();
	};

	const unsubscribeInsert = configPort.onInsert(insertSourcePlaceholder);
	const unsubscribeSwap = configPort.onSwap(insertSourcePlaceholder);

	return () => {
		unsubscribeInsert();
		unsubscribeSwap();
	};
};
