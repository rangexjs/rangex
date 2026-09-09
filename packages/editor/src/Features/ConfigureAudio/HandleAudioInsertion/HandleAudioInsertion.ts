import { createAudio } from "../../_Utilities";
import type { HandleAudioInsertionParams } from "./HandleAudioInsertion-types";

/**
 * Inserts a real audio block at the caret whenever `onMediaResolve` reports a resolved audio
 * source, filtering out every other media type's resolution.
 */
export const handleAudioInsertion = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleAudioInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = configPort.onMediaResolve(({ type, src }) => {
		if (type !== "audio") {
			return;
		}

		const audio = createAudio({ src });

		blockComponentPlacement.insertBySelection({
			lines: [audio],
			shouldReplaceContentLineIfEmpty: true,
		});

		snapshotTimeline.registerSnapshotBoundary();

		selection.setBoundaryPoints({
			fromNode: audio,
			fromOffset: audio.$$childNodes.length,
			toNode: audio,
			toOffset: audio.$$childNodes.length,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
