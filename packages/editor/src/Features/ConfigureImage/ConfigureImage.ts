import { componentsName } from "#constants";
import { imageAttrsShape } from "#dom-attrs";
import { createBlockComponentPlacement } from "#engine-links";
import {
	getMediaParts,
	handleBlockAlignState,
	handleBlockResizeAppearance,
	handleCaptionState,
	handleDOMAttrs,
	handleQuickActionsAppearance,
	handleSelectionComponent,
	handleSwapToSourcePlaceholder,
} from "../_Utilities";
import {
	getImageCaption,
	getImageFigure,
	setImageCaptionEnabled,
	setImageCaptionPosition,
} from "./_Utilities";
import type { ConfigureImageParams } from "./ConfigureImage-types";
import { handleImageInsertion } from "./HandleImageInsertion";

/*
 * Wires up the image feature: insertion, quick-actions overlay, resize, alignment, caption, attributes and
 * source-placeholder swap behavior. Returns a cleanup function that tears down all of it.
 */
export const configureImage = ({
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureImageParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const selectionComponentCleanup = handleSelectionComponent({
		port: configPort,
		editorAPI,
		componentName: componentsName.image,
	});

	const insertionCleanup = handleImageInsertion({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const quickActionsCleanup = handleQuickActionsAppearance({
		port: configPort,
		quickActionsPort: configPort.quickActions,
		editorAPI,
		componentName: componentsName.image,
	});

	const resizeAppearanceCleanup = handleBlockResizeAppearance({
		blockResize: configPort.blockResize,
		editorAPI,
		componentName: componentsName.image,
	});

	const alignStateCleanup = handleBlockAlignState({
		port: configPort,
		editorAPI,
	});

	const captionStateCleanup = handleCaptionState({
		port: configPort,
		editorAPI,
		getFigure: getImageFigure,
		getCaption: getImageCaption,
		setCaptionEnabled: setImageCaptionEnabled,
		setCaptionPosition: setImageCaptionPosition,
	});

	const domAttrsCleanup = handleDOMAttrs({
		currentComponentPort: configPort,
		domAttrsPort: configPort,
		editorAPI,
		componentAttrsShape: imageAttrsShape,
		componentAttrValidators: configPort.attrValidators,
		resolveElements: (image) => {
			const { line, block, media } = getMediaParts({
				blockComponent: image,
				mediaLocalName: "img",
			});

			return { line, block, img: media };
		},
	});

	const swapCleanup = handleSwapToSourcePlaceholder({
		port: configPort,
		editorAPI,
	});

	return () => {
		selectionComponentCleanup();
		insertionCleanup();
		quickActionsCleanup();
		resizeAppearanceCleanup();
		alignStateCleanup();
		captionStateCleanup();
		domAttrsCleanup();
		swapCleanup();
	};
};
