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
} from "../_Utilities";
import {
	getImageCaption,
	getImageFigure,
	setImageCaptionEnabled,
	setImageCaptionPosition,
} from "./_Utilities";
import type { ConfigureImageParams } from "./ConfigureImage-types";
import { handleImageInsertion } from "./HandleImageInsertion";
import { handleImageQuickActionsOverlayAppearance } from "./HandleImageQuickActionsOverlayAppearance";

export const configureImage = ({
	configPort,
	editorAPI,
}: ConfigureImageParams) => {
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

	const insertionCleanup = handleImageInsertion({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const { getCurrentBlock, cleanup: overlayAppearanceCleanup } =
		handleImageQuickActionsOverlayAppearance({
			configPort,
			overlayAppearanceHandler,
			anchorController,
		});

	const resizeAppearanceCleanup = handleBlockResizeAppearance({
		blockResize: configPort.blockResize,
		editorAPI,
		componentName: componentsName.image,
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
		getFigure: getImageFigure,
		getCaption: getImageCaption,
		setCaptionEnabled: setImageCaptionEnabled,
		setCaptionPosition: setImageCaptionPosition,
	});

	return () => {
		overlayAppearanceHandler.cleanup();

		insertionCleanup();
		overlayAppearanceCleanup();
		commitSnapshotCleanup();
		resizeAppearanceCleanup();
		alignStateCleanup();
		captionStateCleanup();
	};
};
