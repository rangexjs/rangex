import { createSeparator } from "../../_Utilities";
import type { HandleSeparatorPlacementParams } from "./HandleSeparatorPlacement-types";

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
