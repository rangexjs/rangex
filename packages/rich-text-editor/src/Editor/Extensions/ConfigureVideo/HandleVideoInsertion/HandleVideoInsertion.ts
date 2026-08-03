import { createVideo } from "../../_Utilities";
import type { HandleVideoInsertionParams } from "./HandleVideoInsertion-types";

/**
 * Inserts a real video block at the caret whenever `onMediaResolve` reports a resolved video
 * source, filtering out every other media type's resolution.
 */
export const handleVideoInsertion = ({
	editorPort,
	editorAPI,
}: HandleVideoInsertionParams) => {
	return editorPort.onMediaResolve(({ type, src }) => {
		if (type !== "video") {
			return;
		}

		const selection = editorAPI.getEditorSelection();
		const { fromText, fromOffset } = selection.getBoundaryPoints();

		editorAPI.insertNode({
			fromNode: fromText,
			fromOffset,
			lines: [createVideo({ src })],
			breakBeforeInsert: false,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});
};
