import { componentsName } from "../../Constants";
import {
	handleBlockAlignState,
	handleBlockDelete,
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
	audioPort,
	editorAPI,
	blockResize,
	blockPopoverAppearanceHandler,
	onMediaResolve,
}: ConfigureAudioParams) => {
	const internals: AudioInternals = { currentAudioFigure: null };

	const blockResizeCleanup = blockResize.registerComponent({
		handleX: 16,
		canShow({ blockNestedContext }) {
			return blockNestedContext.$$componentName === componentsName.audio;
		},
	});

	const insertionCleanup = handleAudioInsertion({
		editorAPI,
		onMediaResolve,
	});

	const { getCurrentBlock, cleanup: popoverAppearanceCleanup } =
		handleAudioPopoverAppearance({
			audioPort,
			blockPopoverAppearanceHandler,
		});

	const alignStateCleanup = handleBlockAlignState({
		port: audioPort,
		editorAPI,
		getCurrentBlock,
	});

	const attrStateCleanup = handleAudioAttrState({
		audioPort,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleCaptionState({
		port: audioPort,
		editorAPI,
		getCurrentBlock,
		getFigure: getAudioFigure,
		getCaption: getAudioCaption,
		setCaptionEnabled: setAudioCaptionEnabled,
		setCaptionPosition: setAudioCaptionPosition,
	});

	const swapPopoverToggleCleanup = handleAudioSwapPopoverToggle({
		audioPort,
		getCurrentBlock,
		internals,
	});

	const swapCleanup = handleAudioSwap({
		audioPort,
		editorAPI,
		internals,
	});

	const deleteCleanup = handleBlockDelete({
		port: audioPort,
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
