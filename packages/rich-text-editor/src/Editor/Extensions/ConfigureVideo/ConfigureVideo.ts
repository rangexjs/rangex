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
import { handleVideoQuickActionsOverlayAppearance } from "./HandleVideoQuickActionsOverlayAppearance";
import { handleVideoSwap } from "./HandleVideoSwap";
import { handleVideoSwapCardOverlayToggle } from "./HandleVideoSwapCardOverlayToggle";

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
					internals.currentVideoFigure = null;
				}
			},
		},
	});

	const insertionCleanup = handleVideoInsertion({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	const { getCurrentBlock, cleanup: overlayAppearanceCleanup } =
		handleVideoQuickActionsOverlayAppearance({
			editorPort,
			overlayAppearanceHandler,
			anchorController,
			swapAnchorController,
		});

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

	const swapCardOverlayToggleCleanup = handleVideoSwapCardOverlayToggle({
		editorPort,
		getCurrentBlock,
		internals,
		swapAnchorController,
	});

	const swapCleanup = handleVideoSwap({
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
