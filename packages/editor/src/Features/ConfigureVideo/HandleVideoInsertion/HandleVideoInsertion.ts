import { createVideo } from "../../_Utilities";
import type { HandleVideoInsertionParams } from "./HandleVideoInsertion-types";

/**
 * Inserts a real video block at the caret whenever `onMediaResolve` reports a resolved video
 * source, filtering out every other media type's resolution.
 */
export const handleVideoInsertion = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleVideoInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = configPort.onMediaResolve(({ type, src }) => {
		if (type !== "video") {
			return;
		}

		const video = createVideo({ src });

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
