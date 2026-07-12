import { componentsName } from "../../Constants";
import type { ConfigureVideoParams } from "./ConfigureVideo-types";
import { handleVideoAlignState } from "./HandleVideoAlignState";
import { handleVideoAspectRatioState } from "./HandleVideoAspectRatioState";
import { handleVideoCaptionState } from "./HandleVideoCaptionState";
import { handleVideoDelete } from "./HandleVideoDelete";
import { handleVideoInsertion } from "./HandleVideoInsertion";
import { handleVideoObjectFitState } from "./HandleVideoObjectFitState";
import { handleVideoPlaybackState } from "./HandleVideoPlaybackState";
import { handleVideoPopoverAppearance } from "./HandleVideoPopoverAppearance";
import { handleVideoPosterState } from "./HandleVideoPosterState";
import { handleVideoSwap } from "./HandleVideoSwap";
import { handleVideoTitleState } from "./HandleVideoTitleState";
import { handleVideoToolbarButtonState } from "./HandleVideoToolbarButtonState";

// TODO: file uploads are inlined as base64 data URLs (same as configureImage — see
// ReadFileAsDataURL in both features' _Utilities). That doesn't scale to real-world video
// file sizes: every uploaded video gets embedded directly in the document, and duplicated
// into every snapshot/undo boundary. This needs a pluggable upload mechanism (consumer-supplied
// endpoint/blob storage) before it's viable long term.
export const configureVideo = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
	blockResize,
	blockPopoverAppearanceHandler,
}: ConfigureVideoParams) => {
	blockResize.registerComponent({
		componentName: componentsName.video,
		handleX: 16,
	});

	const toolbarButtonStateCleanup = handleVideoToolbarButtonState({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleVideoInsertion({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	const popoverAppearanceCleanup = handleVideoPopoverAppearance({
		richTextEditorUI,
		blockPopoverAppearanceHandler,
	});

	const alignStateCleanup = handleVideoAlignState({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	const objectFitStateCleanup = handleVideoObjectFitState({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	const aspectRatioStateCleanup = handleVideoAspectRatioState({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	const captionStateCleanup = handleVideoCaptionState({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	const titleStateCleanup = handleVideoTitleState({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	const playbackStateCleanup = handleVideoPlaybackState({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	const posterStateCleanup = handleVideoPosterState({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	const swapCleanup = handleVideoSwap({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	const deleteCleanup = handleVideoDelete({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	return () => {
		blockResize.unregisterComponent({ componentName: componentsName.video });
		toolbarButtonStateCleanup();
		insertionCleanup();
		popoverAppearanceCleanup();
		alignStateCleanup();
		objectFitStateCleanup();
		aspectRatioStateCleanup();
		captionStateCleanup();
		titleStateCleanup();
		playbackStateCleanup();
		posterStateCleanup();
		swapCleanup();
		deleteCleanup();
	};
};
