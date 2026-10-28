import { createAudio } from "../../_Utilities";
import type { HandleAudioInsertionParams } from "./HandleAudioInsertion-types";

/*
 * Inserts a real audio block at the caret whenever media resolution reports a resolved audio
 * source, ignoring resolutions for other media types.
 */
export const handleAudioInsertion = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleAudioInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = configPort.onMediaResolve((params) => {
		if (params.type !== "audio") {
			return;
		}

		const audio = createAudio({ attrs: params.attrs });

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
