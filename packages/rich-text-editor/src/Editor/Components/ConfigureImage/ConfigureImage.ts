import { componentsName } from "../../Constants";
import {
	handleBlockAlignState,
	handleBlockDelete,
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
// upload mechanism (consumer-supplied endpoint/blob storage) eventually. configureVideo
// currently mirrors this same approach, where the problem is much more pronounced.
export const configureImage = ({
	imagePort,
	editorAPI,
	blockResize,
	blockPopoverAppearanceHandler,
	onMediaResolve,
}: ConfigureImageParams) => {
	const internals: ImageInternals = { currentImageFigure: null };

	const blockResizeCleanup = blockResize.registerComponent({
		handleX: 16,
		canShow({ blockNestedContext }) {
			return blockNestedContext.$$componentName === componentsName.image;
		},
	});

	const insertionCleanup = handleImageInsertion({
		editorAPI,
		onMediaResolve,
	});

	const { getCurrentBlock, cleanup: popoverAppearanceCleanup } =
		handleImagePopoverAppearance({
			imagePort,
			blockPopoverAppearanceHandler,
		});

	const alignStateCleanup = handleBlockAlignState({
		port: imagePort,
		editorAPI,
		getCurrentBlock,
	});

	const attrStateCleanup = handleImageAttrState({
		imagePort,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleCaptionState({
		port: imagePort,
		editorAPI,
		getCurrentBlock,
		getFigure: getImageFigure,
		getCaption: getImageCaption,
		setCaptionEnabled: setImageCaptionEnabled,
		setCaptionPosition: setImageCaptionPosition,
	});

	const swapPopoverToggleCleanup = handleImageSwapPopoverToggle({
		imagePort,
		getCurrentBlock,
		internals,
	});

	const swapCleanup = handleImageSwap({
		imagePort,
		editorAPI,
		internals,
	});

	const deleteCleanup = handleBlockDelete({
		port: imagePort,
		editorAPI,
		getCurrentBlock,
	});

	return () => {
		blockResizeCleanup();
		insertionCleanup();
		popoverAppearanceCleanup();
		alignStateCleanup();
		attrStateCleanup();
		captionStateCleanup();
		swapPopoverToggleCleanup();
		swapCleanup();
		deleteCleanup();
	};
};
