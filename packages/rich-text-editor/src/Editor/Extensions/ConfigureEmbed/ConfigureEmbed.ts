import { componentsName } from "#ports";
import { createAnchoredOverlayController } from "../../_Utilities";
import { createOverlayAppearanceHandler } from "../../OverlayAppearanceHandler";
import {
	handleBlockAlignState,
	handleBlockResizeAppearance,
	handleCaptionState,
} from "../_Utilities";
import {
	getEmbedCaption,
	getEmbedFigure,
	setEmbedCaptionEnabled,
	setEmbedCaptionPosition,
} from "./_Utilities";
import type {
	ConfigureEmbedParams,
	EmbedInternals,
} from "./ConfigureEmbed-types";
import { handleEmbedAttrState } from "./HandleEmbedAttrState";
import { handleEmbedInsertion } from "./HandleEmbedInsertion";
import { handleEmbedQuickActionsOverlayAppearance } from "./HandleEmbedQuickActionsOverlayAppearance";
import { handleEmbedSwap } from "./HandleEmbedSwap";
import { handleEmbedSwapCardOverlayToggle } from "./HandleEmbedSwapCardOverlayToggle";

export const configureEmbed = ({
	editorPort,
	editorAPI,
}: ConfigureEmbedParams) => {
	const internals: EmbedInternals = { currentEmbedFigure: null };
	const overlayAppearanceHandler = createOverlayAppearanceHandler({
		editorAPI,
	});

	editorPort.quickActionsOverlay.mount();
	editorPort.swapCardOverlay.mount();
	editorPort.blockResize.mount();

	const anchorController = createAnchoredOverlayController({
		element: editorPort.quickActionsOverlay.element,
		options: {
			onToggle: (isOpen) => editorPort.updateState({ isOpen }),
		},
	});

	const swapAnchorController = createAnchoredOverlayController({
		element: editorPort.swapCardOverlay.element,
		options: {
			onToggle: (swapIsOpen) => {
				editorPort.updateState({ swapIsOpen });

				if (!swapIsOpen) {
					internals.currentEmbedFigure = null;
				}
			},
		},
	});

	const insertionCleanup = handleEmbedInsertion({ editorPort, editorAPI });

	const { getCurrentBlock, cleanup: overlayAppearanceCleanup } =
		handleEmbedQuickActionsOverlayAppearance({
			editorPort,
			overlayAppearanceHandler,
			anchorController,
			swapAnchorController,
		});

	const resizeAppearanceCleanup = handleBlockResizeAppearance({
		blockResize: editorPort.blockResize,
		editorAPI,
		componentName: componentsName.embed,
	});

	const alignStateCleanup = handleBlockAlignState({
		port: editorPort,
		editorAPI,
		getCurrentBlock,
	});

	const attrStateCleanup = handleEmbedAttrState({
		editorPort,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleCaptionState({
		port: editorPort,
		editorAPI,
		getCurrentBlock,
		getFigure: getEmbedFigure,
		getCaption: getEmbedCaption,
		setCaptionEnabled: setEmbedCaptionEnabled,
		setCaptionPosition: setEmbedCaptionPosition,
	});

	const swapCardOverlayToggleCleanup = handleEmbedSwapCardOverlayToggle({
		editorPort,
		getCurrentBlock,
		internals,
		swapAnchorController,
	});

	const swapCleanup = handleEmbedSwap({
		editorPort,
		editorAPI,
		internals,
		swapAnchorController,
	});

	return () => {
		overlayAppearanceHandler.cleanup();
		editorPort.quickActionsOverlay.unmount();
		editorPort.swapCardOverlay.unmount();
		editorPort.blockResize.unmount();

		insertionCleanup();
		overlayAppearanceCleanup();
		resizeAppearanceCleanup();
		alignStateCleanup();
		attrStateCleanup();
		captionStateCleanup();
		swapCardOverlayToggleCleanup();
		swapCleanup();
	};
};
