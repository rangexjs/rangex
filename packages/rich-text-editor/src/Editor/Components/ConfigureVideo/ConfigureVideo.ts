import { componentsName } from "../../Constants";
import {
	handleBlockAlignState,
	handleBlockDelete,
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
	videoPort,
	editorAPI,
	blockResize,
	blockPopoverAppearanceHandler,
	onMediaResolve,
}: ConfigureVideoParams) => {
	const internals: VideoInternals = { currentVideoFigure: null };

	const blockResizeCleanup = blockResize.registerComponent({
		handleX: 16,
		canShow({ blockNestedContext }) {
			return blockNestedContext.$$componentName === componentsName.video;
		},
	});

	const insertionCleanup = handleVideoInsertion({
		editorAPI,
		onMediaResolve,
	});

	const { getCurrentBlock, cleanup: popoverAppearanceCleanup } =
		handleVideoPopoverAppearance({
			videoPort,
			blockPopoverAppearanceHandler,
		});

	const alignStateCleanup = handleBlockAlignState({
		port: videoPort,
		editorAPI,
		getCurrentBlock,
	});

	const attrStateCleanup = handleVideoAttrState({
		videoPort,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleCaptionState({
		port: videoPort,
		editorAPI,
		getCurrentBlock,
		getFigure: getVideoFigure,
		getCaption: getVideoCaption,
		setCaptionEnabled: setVideoCaptionEnabled,
		setCaptionPosition: setVideoCaptionPosition,
	});

	const swapPopoverToggleCleanup = handleVideoSwapPopoverToggle({
		videoPort,
		getCurrentBlock,
		internals,
	});

	const swapCleanup = handleVideoSwap({
		videoPort,
		editorAPI,
		internals,
	});

	const deleteCleanup = handleBlockDelete({
		port: videoPort,
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
