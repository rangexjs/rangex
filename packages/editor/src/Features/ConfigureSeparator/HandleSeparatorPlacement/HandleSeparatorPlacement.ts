import { createSeparator } from "../../_Utilities";
import type { HandleSeparatorPlacementParams } from "./HandleSeparatorPlacement-types";

/*
 * Listens for insert requests and inserts a separator at the current selection, moving the
 * caret past it. Returns a cleanup function that unsubscribes the listener.
 */
export const handleSeparatorPlacement = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleSeparatorPlacementParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = configPort.onInsert(() => {
		const separatorLine = createSeparator();

		blockComponentPlacement.insertBySelection({
			lines: [separatorLine],
			shouldReplaceContentLineIfEmpty: true,
		});

		snapshotTimeline.registerSnapshotBoundary();

		selection.setBoundaryPoints({
			fromNode: separatorLine,
			fromOffset: separatorLine.$$childNodes.length,
			toNode: separatorLine,
			toOffset: separatorLine.$$childNodes.length,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
