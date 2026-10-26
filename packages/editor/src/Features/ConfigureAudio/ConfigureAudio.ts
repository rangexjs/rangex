import { componentsName } from "#constants";
import { createBlockComponentPlacement } from "#engine-links";
import {
	handleBlockAlignState,
	handleBlockResizeAppearance,
	handleCaptionState,
	handleQuickActionsAppearance,
	handleSelectionComponent,
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
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureAudioParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const selectionComponentCleanup = handleSelectionComponent({
		port: configPort,
		editorAPI,
		componentName: componentsName.audio,
	});

	const insertionCleanup = handleAudioInsertion({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const quickActionsCleanup = handleQuickActionsAppearance({
		port: configPort,
		quickActionsPort: configPort.quickActions,
		editorAPI,
		componentName: componentsName.audio,
	});

	const resizeAppearanceCleanup = handleBlockResizeAppearance({
		blockResize: configPort.blockResize,
		editorAPI,
		componentName: componentsName.audio,
	});

	const alignStateCleanup = handleBlockAlignState({
		port: configPort,
		editorAPI,
	});

	const captionStateCleanup = handleCaptionState({
		port: configPort,
		editorAPI,
		getFigure: getAudioFigure,
		getCaption: getAudioCaption,
		setCaptionEnabled: setAudioCaptionEnabled,
		setCaptionPosition: setAudioCaptionPosition,
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
