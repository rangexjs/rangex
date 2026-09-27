import { componentsName, createBlockComponentPlacement } from "#engine-links";
import {
	handleBlockAlignState,
	handleBlockResizeAppearance,
	handleCaptionState,
	handleQuickActionsAppearance,
	handleSelectionComponent,
	handleSwapToEmptyMedia,
} from "../_Utilities";
import {
	getEmbedCaption,
	getEmbedFigure,
	setEmbedCaptionEnabled,
	setEmbedCaptionPosition,
} from "./_Utilities";
import type { ConfigureEmbedParams } from "./ConfigureEmbed-types";
import { handleEmbedInsertion } from "./HandleEmbedInsertion";

/*
 * Wires up the embed feature: insertion, quick-actions overlay, resize, alignment, caption and
 * empty-media swap behavior. Returns a cleanup function that tears down all of it.
 */
export const configureEmbed = ({
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureEmbedParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const selectionComponentCleanup = handleSelectionComponent({
		port: configPort,
		editorAPI,
		componentName: componentsName.embed,
	});

	const insertionCleanup = handleEmbedInsertion({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const quickActionsCleanup = handleQuickActionsAppearance({
		port: configPort,
		quickActionsPort: configPort.quickActions,
		editorAPI,
		componentName: componentsName.embed,
	});

	const resizeAppearanceCleanup = handleBlockResizeAppearance({
		blockResize: configPort.blockResize,
		editorAPI,
		componentName: componentsName.embed,
	});

	const alignStateCleanup = handleBlockAlignState({
		port: configPort,
		editorAPI,
	});

	const captionStateCleanup = handleCaptionState({
		port: configPort,
		editorAPI,
		getFigure: getEmbedFigure,
		getCaption: getEmbedCaption,
		setCaptionEnabled: setEmbedCaptionEnabled,
		setCaptionPosition: setEmbedCaptionPosition,
	});

	const swapCleanup = handleSwapToEmptyMedia({
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
		swapCleanup();
	};
};
