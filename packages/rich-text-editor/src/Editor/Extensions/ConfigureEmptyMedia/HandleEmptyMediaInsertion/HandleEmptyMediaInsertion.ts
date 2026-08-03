import { createBeamText, createContentLine } from "rich-text-area";
import { createEmptyMedia } from "../../_Utilities";
import type { HandleEmptyMediaInsertionParams } from "./HandleEmptyMediaInsertion-types";

export const handleEmptyMediaInsertion = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleEmptyMediaInsertionParams) => {
	const unsubscribe = editorPort.onInsertRequest(() => {
		const emptyMediaLine = createEmptyMedia();

		const trailingLine = createContentLine({
			localName: "p",
			childNodes: [createBeamText()],
		});

		blockComponentPlacement.insertBySelection({
			lines: [emptyMediaLine, trailingLine],
			shouldReplaceContentLineIfEmpty: true,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();

		const selection = editorAPI.getEditorSelection();

		selection.setBoundaryPoints({
			fromNode: trailingLine,
			fromOffset: 0,
			toNode: trailingLine,
			toOffset: 0,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
