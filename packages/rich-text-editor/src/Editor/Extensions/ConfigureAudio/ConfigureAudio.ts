import { componentsName } from "#ports";
import { createOverlayAppearanceHandler } from "../../OverlayAppearanceHandler";
import {
	handleBlockAlignState,
	handleBlockDelete,
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
import { handleAudioPopoverAppearance } from "./HandleAudioPopoverAppearance";
import { handleAudioSwap } from "./HandleAudioSwap";
import { handleAudioSwapPopoverToggle } from "./HandleAudioSwapPopoverToggle";

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

	editorPort.popover.mount();
	editorPort.blockResize.mount();

	const insertionCleanup = handleAudioInsertion({ editorPort, editorAPI });

	const { getCurrentBlock, cleanup: popoverAppearanceCleanup } =
		handleAudioPopoverAppearance({ editorPort, overlayAppearanceHandler });

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

	const swapPopoverToggleCleanup = handleAudioSwapPopoverToggle({
		editorPort,
		getCurrentBlock,
		internals,
	});

	const swapCleanup = handleAudioSwap({ editorPort, editorAPI, internals });

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
