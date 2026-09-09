import { createEmptyMedia } from "../../_Utilities";
import type { HandleEmptyMediaInsertionParams } from "./HandleEmptyMediaInsertion-types";

export const handleEmptyMediaInsertion = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleEmptyMediaInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const insertEmptyMedia = () => {
		const emptyMediaLine = createEmptyMedia();

		blockComponentPlacement.insertBySelection({
			lines: [emptyMediaLine],
			shouldReplaceContentLineIfEmpty: true,
		});

		snapshotTimeline.registerSnapshotBoundary();

		selection.setBoundaryPoints({
			fromNode: emptyMediaLine,
			fromOffset: emptyMediaLine.$$childNodes.length,
			toNode: emptyMediaLine,
			toOffset: emptyMediaLine.$$childNodes.length,
		});

		editorAPI.focus();
	};

	const unsubscribeInsert = configPort.onInsert(insertEmptyMedia);
	const unsubscribeSwap = configPort.onSwap(insertEmptyMedia);

	return () => {
		unsubscribeInsert();
		unsubscribeSwap();
	};
};
