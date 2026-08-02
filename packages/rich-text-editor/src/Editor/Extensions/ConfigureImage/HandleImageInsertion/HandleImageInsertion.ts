import { createImage } from "../../_Utilities";
import type { HandleImageInsertionParams } from "./HandleImageInsertion-types";

/**
 * Inserts a real image block at the caret whenever `onMediaResolve` reports a resolved image
 * source, filtering out every other media type's resolution.
 */
export const handleImageInsertion = ({
	editorPort,
	editorAPI,
}: HandleImageInsertionParams) => {
	return editorPort.onMediaResolve(({ type, src }) => {
		if (type !== "image") {
			return;
		}

		const selection = editorAPI.getEditorSelection();
		const { fromText, fromOffset } = selection.getBoundaryPoints();

		editorAPI.insertNode({
			fromNode: fromText,
			fromOffset,
			lines: [createImage({ src })],
			breakBeforeInsert: false,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});
};
