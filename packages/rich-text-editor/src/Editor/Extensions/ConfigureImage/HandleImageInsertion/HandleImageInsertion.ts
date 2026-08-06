import { createImage } from "../../_Utilities";
import type { HandleImageInsertionParams } from "./HandleImageInsertion-types";

/**
 * Inserts a real image block at the caret whenever `onMediaResolve` reports a resolved image
 * source, filtering out every other media type's resolution.
 */
export const handleImageInsertion = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleImageInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = editorPort.onMediaResolve(({ type, src }) => {
		if (type !== "image") {
			return;
		}

		const image = createImage({ src });

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
