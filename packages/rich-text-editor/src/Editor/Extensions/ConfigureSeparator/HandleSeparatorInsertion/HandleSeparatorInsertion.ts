import { createSeparator } from "../../_Utilities";
import type { HandleSeparatorInsertionParams } from "./HandleSeparatorInsertion-types";

export const handleSeparatorInsertion = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleSeparatorInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = editorPort.onInsertRequest(() => {
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
