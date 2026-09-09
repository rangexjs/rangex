import {
	componentsName,
	createAnchoredOverlayController,
	createBlockComponentPlacement,
	createOverlayAppearanceHandler,
} from "#engine-links";
import {
	handleBlockAlignState,
	handleBlockResizeAppearance,
	handleCaptionState,
	handleCommitSnapshot,
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
import { handleAudioQuickActionsOverlayAppearance } from "./HandleAudioQuickActionsOverlayAppearance";

export const configureAudio = ({
	configPort,
	editorAPI,
}: ConfigureAudioParams) => {
	const overlayAppearanceHandler = createOverlayAppearanceHandler({
		editorAPI,
	});
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const anchorController = createAnchoredOverlayController({
		element: configPort.floatingEl,
		options: {
			onToggle: (isOpen) => configPort.updateState({ isOpen }),
		},
	});

	const commitSnapshotCleanup = handleCommitSnapshot({
		port: configPort,
		editorAPI,
	});

	const insertionCleanup = handleAudioInsertion({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const { getCurrentBlock, cleanup: overlayAppearanceCleanup } =
		handleAudioQuickActionsOverlayAppearance({
			configPort,
			overlayAppearanceHandler,
			anchorController,
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
		overlayAppearanceHandler.cleanup();

		insertionCleanup();
		overlayAppearanceCleanup();
		commitSnapshotCleanup();
		resizeAppearanceCleanup();
		alignStateCleanup();
		captionStateCleanup();
		swapCleanup();
	};
};
