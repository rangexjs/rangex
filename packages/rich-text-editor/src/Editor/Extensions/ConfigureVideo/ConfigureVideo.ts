import { componentsName } from "#ports";
import { createOverlayAppearanceHandler } from "../../OverlayAppearanceHandler";
import {
	handleBlockAlignState,
	handleBlockDelete,
	handleBlockResizeAppearance,
	handleCaptionState,
} from "../_Utilities";
import {
	getVideoCaption,
	getVideoFigure,
	setVideoCaptionEnabled,
	setVideoCaptionPosition,
} from "./_Utilities";
import type {
	ConfigureVideoParams,
	VideoInternals,
} from "./ConfigureVideo-types";
import { handleVideoAttrState } from "./HandleVideoAttrState";
import { handleVideoInsertion } from "./HandleVideoInsertion";
import { handleVideoPopoverAppearance } from "./HandleVideoPopoverAppearance";
import { handleVideoSwap } from "./HandleVideoSwap";
import { handleVideoSwapPopoverToggle } from "./HandleVideoSwapPopoverToggle";

// TODO: file uploads are inlined as base64 data URLs (see uploadMediaFile in
// src/Editor/_Utilities) instead of going through any upload endpoint or blob
// storage. This embeds the full file bytes directly in the document and in every
// snapshot/undo boundary. It works for now but isn't viable long term — needs a pluggable
// upload mechanism (consumer-supplied endpoint/blob storage) eventually.
export const configureVideo = ({
	editorPort,
	editorAPI,
}: ConfigureVideoParams) => {
	const internals: VideoInternals = { currentVideoFigure: null };
	const overlayAppearanceHandler = createOverlayAppearanceHandler({
		editorAPI,
	});

	editorPort.popover.mount();
	editorPort.blockResize.mount();

	const insertionCleanup = handleVideoInsertion({ editorPort, editorAPI });

	const { getCurrentBlock, cleanup: popoverAppearanceCleanup } =
		handleVideoPopoverAppearance({ editorPort, overlayAppearanceHandler });

	const resizeAppearanceCleanup = handleBlockResizeAppearance({
		blockResize: editorPort.blockResize,
		editorAPI,
		componentName: componentsName.video,
	});

	const alignStateCleanup = handleBlockAlignState({
		port: editorPort,
		editorAPI,
		getCurrentBlock,
	});

	const attrStateCleanup = handleVideoAttrState({
		editorPort,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleCaptionState({
		port: editorPort,
		editorAPI,
		getCurrentBlock,
		getFigure: getVideoFigure,
		getCaption: getVideoCaption,
		setCaptionEnabled: setVideoCaptionEnabled,
		setCaptionPosition: setVideoCaptionPosition,
	});

	const swapPopoverToggleCleanup = handleVideoSwapPopoverToggle({
		editorPort,
		getCurrentBlock,
		internals,
	});

	const swapCleanup = handleVideoSwap({ editorPort, editorAPI, internals });

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
