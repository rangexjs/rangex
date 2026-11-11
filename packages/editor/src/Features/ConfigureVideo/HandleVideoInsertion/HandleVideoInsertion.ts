import { createVideo } from "../../_Utilities";
import type { HandleVideoInsertionParams } from "./HandleVideoInsertion-types";

/*
 * Inserts a real video block at the caret whenever media resolution reports a resolved video
 * source, ignoring resolutions for other media types.
 */
export const handleVideoInsertion = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleVideoInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = configPort.onMediaResolve((params) => {
		if (params.type !== "video") {
			return;
		}

		const video = createVideo({ attrs: params.attrs });

		blockComponentPlacement.insertBySelection({
			lines: [video],
			shouldReplaceContentLineIfEmpty: true,
		});

		snapshotTimeline.registerSnapshotBoundary();

		selection.setBoundaryPoints({
			fromNode: video,
			fromOffset: video.$$childNodes.length,
			toNode: video,
			toOffset: video.$$childNodes.length,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
