import { createEmbed } from "../../_Utilities";
import type { HandleEmbedInsertionParams } from "./HandleEmbedInsertion-types";

/**
 * Inserts a real embed block at the caret whenever `onMediaResolve` reports a resolved embed
 * source, filtering out every other media type's resolution.
 */
export const handleEmbedInsertion = ({
	editorPort,
	editorAPI,
}: HandleEmbedInsertionParams) => {
	return editorPort.onMediaResolve(({ type, src }) => {
		if (type !== "embed") {
			return;
		}

		const selection = editorAPI.getEditorSelection();
		const { fromText, fromOffset } = selection.getBoundaryPoints();

		editorAPI.insertNode({
			fromNode: fromText,
			fromOffset,
			lines: [createEmbed({ src })],
			breakBeforeInsert: false,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});
};
