import { createEmbed } from "../../_Utilities";
import type { HandleEmbedInsertionParams } from "./HandleEmbedInsertion-types";

/*
 * Inserts a real embed block at the caret whenever media resolution reports a resolved embed
 * source, ignoring resolutions for other media types.
 */
export const handleEmbedInsertion = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
}: HandleEmbedInsertionParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();
	const selection = editorAPI.getEditorSelection();

	const unsubscribe = configPort.onMediaResolve((params) => {
		if (params.type !== "embed") {
			return;
		}

		const embed = createEmbed({ attrs: params.attrs });

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
