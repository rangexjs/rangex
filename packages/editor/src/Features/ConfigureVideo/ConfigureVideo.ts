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
	getVideoCaption,
	getVideoFigure,
	setVideoCaptionEnabled,
	setVideoCaptionPosition,
} from "./_Utilities";
import type { ConfigureVideoParams } from "./ConfigureVideo-types";
import { handleVideoInsertion } from "./HandleVideoInsertion";
import { handleVideoQuickActionsOverlayAppearance } from "./HandleVideoQuickActionsOverlayAppearance";

export const configureVideo = ({
	configPort,
	editorAPI,
}: ConfigureVideoParams) => {
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

	const insertionCleanup = handleVideoInsertion({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const { getCurrentBlock, cleanup: overlayAppearanceCleanup } =
		handleVideoQuickActionsOverlayAppearance({
			configPort,
			overlayAppearanceHandler,
			anchorController,
		});

	const resizeAppearanceCleanup = handleBlockResizeAppearance({
		blockResize: configPort.blockResize,
		editorAPI,
		componentName: componentsName.video,
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
		getFigure: getVideoFigure,
		getCaption: getVideoCaption,
		setCaptionEnabled: setVideoCaptionEnabled,
		setCaptionPosition: setVideoCaptionPosition,
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
