import { componentsName } from "#ports";
import { createAnchoredOverlayController } from "../../_Utilities";
import { createBlockComponentPlacement } from "../../BlockComponentPlacement";
import { createOverlayAppearanceHandler } from "../../OverlayAppearanceHandler";
import {
	handleBlockAlignState,
	handleBlockResizeAppearance,
	handleCaptionState,
} from "../_Utilities";
import {
	getAudioCaption,
	getAudioFigure,
	setAudioCaptionEnabled,
	setAudioCaptionPosition,
} from "./_Utilities";
import type {
	AudioInternals,
	ConfigureAudioParams,
} from "./ConfigureAudio-types";
import { handleAudioAttrState } from "./HandleAudioAttrState";
import { handleAudioInsertion } from "./HandleAudioInsertion";
import { handleAudioQuickActionsOverlayAppearance } from "./HandleAudioQuickActionsOverlayAppearance";
import { handleAudioSwap } from "./HandleAudioSwap";
import { handleAudioSwapCardOverlayToggle } from "./HandleAudioSwapCardOverlayToggle";

// TODO: file uploads are inlined as base64 data URLs (see uploadMediaFile in
// src/Editor/_Utilities) instead of going through any upload endpoint or blob
// storage. This embeds the full file bytes directly in the document and in every
// snapshot/undo boundary. It works for now but isn't viable long term — needs a pluggable
// upload mechanism (consumer-supplied endpoint/blob storage) eventually.
export const configureAudio = ({
	editorPort,
	editorAPI,
}: ConfigureAudioParams) => {
	const internals: AudioInternals = { currentAudioFigure: null };
	const overlayAppearanceHandler = createOverlayAppearanceHandler({
		editorAPI,
	});
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	editorPort.quickActionsOverlay.mount();
	editorPort.swapCardOverlay.mount();
	editorPort.blockResize.mount();

	const anchorController = createAnchoredOverlayController({
		element: editorPort.quickActionsOverlay.element,
		options: {
			onToggle: (isQuickActionsOpen) =>
				editorPort.updateState({ isQuickActionsOpen }),
		},
	});

	const swapAnchorController = createAnchoredOverlayController({
		element: editorPort.swapCardOverlay.element,
		options: {
			onToggle: (isSwapCardOpen) => {
				editorPort.updateState({ isSwapCardOpen });

				if (!isSwapCardOpen) {
					internals.currentAudioFigure = null;
				}
			},
		},
	});

	const insertionCleanup = handleAudioInsertion({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	const { getCurrentBlock, cleanup: overlayAppearanceCleanup } =
		handleAudioQuickActionsOverlayAppearance({
			editorPort,
			overlayAppearanceHandler,
			anchorController,
			swapAnchorController,
		});

	const resizeAppearanceCleanup = handleBlockResizeAppearance({
		blockResize: editorPort.blockResize,
		editorAPI,
		componentName: componentsName.audio,
	});

	const alignStateCleanup = handleBlockAlignState({
		port: editorPort,
		editorAPI,
		getCurrentBlock,
	});

	const attrStateCleanup = handleAudioAttrState({
		editorPort,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleCaptionState({
		port: editorPort,
		editorAPI,
		getCurrentBlock,
		getFigure: getAudioFigure,
		getCaption: getAudioCaption,
		setCaptionEnabled: setAudioCaptionEnabled,
		setCaptionPosition: setAudioCaptionPosition,
	});

	const swapCardOverlayToggleCleanup = handleAudioSwapCardOverlayToggle({
		editorPort,
		getCurrentBlock,
		internals,
		swapAnchorController,
	});

	const swapCleanup = handleAudioSwap({
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
