import { createEmbed } from "../../_Utilities";
import type { HandleEmbedInsertionParams } from "./HandleEmbedInsertion-types";

/**
 * Inserts a real embed block at the caret whenever `onMediaResolve` reports a resolved embed
 * source, filtering out every other media type's resolution.
 */
export const handleEmbedInsertion = ({
	editorPort,
	editorAPI,
	blockComponentPlacement,
}: HandleEmbedInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = editorPort.onMediaResolve(({ type, src }) => {
		if (type !== "embed") {
			return;
		}

		const embed = createEmbed({ src });

		blockComponentPlacement.insertBySelection({
			lines: [embed],
			shouldReplaceContentLineIfEmpty: true,
		});

		snapshotTimeline.registerSnapshotBoundary();

		selection.setBoundaryPoints({
			fromNode: embed,
			fromOffset: embed.$$childNodes.length,
			toNode: embed,
			toOffset: embed.$$childNodes.length,
		});

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
