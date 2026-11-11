import { createImage } from "../../_Utilities";
import type { HandleImageInsertionParams } from "./HandleImageInsertion-types";

/*
 * Inserts a real image block at the caret whenever media resolution reports a resolved image
 * source, ignoring resolutions for other media types.
 */
export const handleImageInsertion = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleImageInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = configPort.onMediaResolve((params) => {
		if (params.type !== "image") {
			return;
		}

		const image = createImage({ attrs: params.attrs });

		blockComponentPlacement.insertBySelection({
			lines: [image],
			shouldReplaceContentLineIfEmpty: true,
		});

		snapshotTimeline.registerSnapshotBoundary();

		selection.setBoundaryPoints({
			fromNode: image,
			fromOffset: image.$$childNodes.length,
			toNode: image,
			toOffset: image.$$childNodes.length,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
