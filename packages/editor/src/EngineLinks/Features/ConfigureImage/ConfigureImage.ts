import { createAnchoredOverlayController } from "../../_Utilities";
import { createBlockComponentPlacement } from "../../BlockComponentPlacement";
import { componentsName } from "../../Constants";
import { createOverlayAppearanceHandler } from "../../OverlayAppearanceHandler";
import {
	handleBlockAlignState,
	handleBlockResizeAppearance,
	handleCaptionState,
} from "../_Utilities";
import {
	getImageCaption,
	getImageFigure,
	setImageCaptionEnabled,
	setImageCaptionPosition,
} from "./_Utilities";
import type {
	ConfigureImageParams,
	// ImageInternals,
} from "./ConfigureImage-types";
import { handleImageInsertion } from "./HandleImageInsertion";
import { handleImageQuickActionsOverlayAppearance } from "./HandleImageQuickActionsOverlayAppearance";
// import { handleImageSwap } from "./HandleImageSwap";

export const configureImage = ({
	configPort,
	editorAPI,
}: ConfigureImageParams) => {
	// const internals: ImageInternals = { currentImageFigure: null };
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

	const insertionCleanup = handleImageInsertion({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const { getCurrentBlock, cleanup: overlayAppearanceCleanup } =
		handleImageQuickActionsOverlayAppearance({
			configPort: configPort,
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

	// const swapCleanup = handleImageSwap({
	// 	editorPort: configPort,
	// 	editorAPI,
	// 	internals,
	// 	swapAnchorController,
	// });

	return () => {
		overlayAppearanceHandler.cleanup();

		insertionCleanup();
		overlayAppearanceCleanup();
		resizeAppearanceCleanup();
		alignStateCleanup();
		captionStateCleanup();
		// swapCleanup();
	};
};
