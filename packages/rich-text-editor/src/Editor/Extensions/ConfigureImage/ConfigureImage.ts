import { componentsName } from "#ports";
import { createOverlayAppearanceHandler } from "../../OverlayAppearanceHandler";
import {
	handleBlockAlignState,
	handleBlockDelete,
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
	ImageInternals,
} from "./ConfigureImage-types";
import { handleImageAttrState } from "./HandleImageAttrState";
import { handleImageInsertion } from "./HandleImageInsertion";
import { handleImagePopoverAppearance } from "./HandleImagePopoverAppearance";
import { handleImageSwap } from "./HandleImageSwap";
import { handleImageSwapPopoverToggle } from "./HandleImageSwapPopoverToggle";

// TODO: file uploads are inlined as base64 data URLs (see uploadMediaFile in
// src/Editor/_Utilities) instead of going through any upload endpoint or blob
// storage. This embeds the full image bytes directly in the document and in every
// snapshot/undo boundary. It works for now but isn't viable long term — needs a pluggable
// upload mechanism (consumer-supplied endpoint/blob storage) eventually.
export const configureImage = ({
	editorPort,
	editorAPI,
}: ConfigureImageParams) => {
	const internals: ImageInternals = { currentImageFigure: null };
	const overlayAppearanceHandler = createOverlayAppearanceHandler({
		editorAPI,
	});

	editorPort.popover.mount();
	editorPort.blockResize.mount();

	const insertionCleanup = handleImageInsertion({ editorPort, editorAPI });

	const { getCurrentBlock, cleanup: popoverAppearanceCleanup } =
		handleImagePopoverAppearance({ editorPort, overlayAppearanceHandler });

	const resizeAppearanceCleanup = handleBlockResizeAppearance({
		blockResize: editorPort.blockResize,
		editorAPI,
		componentName: componentsName.image,
	});

	const alignStateCleanup = handleBlockAlignState({
		port: editorPort,
		editorAPI,
		getCurrentBlock,
	});

	const attrStateCleanup = handleImageAttrState({
		editorPort,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleCaptionState({
		port: editorPort,
		editorAPI,
		getCurrentBlock,
		getFigure: getImageFigure,
		getCaption: getImageCaption,
		setCaptionEnabled: setImageCaptionEnabled,
		setCaptionPosition: setImageCaptionPosition,
	});

	const swapPopoverToggleCleanup = handleImageSwapPopoverToggle({
		editorPort,
		getCurrentBlock,
		internals,
	});

	const swapCleanup = handleImageSwap({ editorPort, editorAPI, internals });

	const deleteCleanup = handleBlockDelete({
		port: editorPort,
		editorAPI,
		getCurrentBlock,
	});

	return () => {
		overlayAppearanceHandler.cleanup();
		editorPort.popover.unmount();
		editorPort.blockResize.unmount();

		insertionCleanup();
		popoverAppearanceCleanup();
		resizeAppearanceCleanup();
		alignStateCleanup();
		attrStateCleanup();
		captionStateCleanup();
		swapPopoverToggleCleanup();
		swapCleanup();
		deleteCleanup();
	};
};
