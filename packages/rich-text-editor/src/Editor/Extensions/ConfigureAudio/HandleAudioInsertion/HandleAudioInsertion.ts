import { createAudio } from "../../_Utilities";
import type { HandleAudioInsertionParams } from "./HandleAudioInsertion-types";

/**
 * Inserts a real audio block at the caret whenever `onMediaResolve` reports a resolved audio
 * source, filtering out every other media type's resolution.
 */
export const handleAudioInsertion = ({
	editorPort,
	editorAPI,
}: HandleAudioInsertionParams) => {
	return editorPort.onMediaResolve(({ type, src }) => {
		if (type !== "audio") {
			return;
		}

		const selection = editorAPI.getEditorSelection();
		const { fromText, fromOffset } = selection.getBoundaryPoints();

		editorAPI.insertNode({
			fromNode: fromText,
			fromOffset,
			lines: [createAudio({ src })],
			breakBeforeInsert: false,
		});

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});
};
