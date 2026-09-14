import { componentsName, createBlockComponentPlacement } from "#engine-links";
import {
	getBlockAlign,
	handleBlockAlignState,
	handleBlockResizeAppearance,
	handleCaptionState,
	handleCommitSnapshot,
	handleQuickActionsOverlayAppearance,
	handleSwapToEmptyMedia,
} from "../_Utilities";
import {
	getAudioCaption,
	getAudioFigure,
	setAudioCaptionEnabled,
	setAudioCaptionPosition,
} from "./_Utilities";
import type { ConfigureAudioParams } from "./ConfigureAudio-types";
import { handleAudioInsertion } from "./HandleAudioInsertion";

/*
 * Wires up the audio feature: insertion, quick-actions overlay, resize, alignment, caption and
 * empty-media swap behavior. Returns a cleanup function that tears down all of it.
 */
export const configureAudio = ({
	configPort,
	editorAPI,
}: ConfigureAudioParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const commitSnapshotCleanup = handleCommitSnapshot({
		port: configPort,
		editorAPI,
	});

	const insertionCleanup = handleAudioInsertion({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const { getCurrentBlock, cleanup: quickActionsCleanup } =
		handleQuickActionsOverlayAppearance({
			port: configPort,
			quickActionsPort: configPort.quickActions,
			editorAPI,
			componentName: componentsName.audio,
			beforeOpen({ blockComponent }) {
				const { $$parentElement } = blockComponent;

				if (!$$parentElement) {
					throw new Error("ParentElement not supposed to be null.");
				}

				const align = getBlockAlign({ blockComponentLine: $$parentElement });
				const figure = getAudioFigure({ blockComponent });
				const caption = getAudioCaption({ figure });

				configPort.updateBlockAlign({ align });
				configPort.updateCaption(caption);
			},
		});

	const resizeAppearanceCleanup = handleBlockResizeAppearance({
		blockResize: configPort.blockResize,
		editorAPI,
		componentName: componentsName.audio,
	});

	const alignStateCleanup = handleBlockAlignState({
		port: configPort,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleCaptionState({
		port: configPort,
		editorAPI,
		getCurrentBlock,
		getFigure: getAudioFigure,
		getCaption: getAudioCaption,
		setCaptionEnabled: setAudioCaptionEnabled,
		setCaptionPosition: setAudioCaptionPosition,
	});

	const swapCleanup = handleSwapToEmptyMedia({
		port: configPort,
		editorAPI,
		getCurrentBlock,
	});

	return () => {
		insertionCleanup();
		quickActionsCleanup();
		commitSnapshotCleanup();
		resizeAppearanceCleanup();
		alignStateCleanup();
		captionStateCleanup();
		swapCleanup();
	};
};
