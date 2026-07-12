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
	const blockResizeCleanup = blockResize.registerComponent({
		handleX: 16,
		canShow({ blockNestedContext }) {
			return blockNestedContext.$$componentName === componentsName.video;
		},
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

	const { getCurrentBlock, cleanup: popoverAppearanceCleanup } =
		handleVideoPopoverAppearance({
			richTextEditorUI,
			blockPopoverAppearanceHandler,
		});

	const alignStateCleanup = handleVideoAlignState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const objectFitStateCleanup = handleVideoObjectFitState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const aspectRatioStateCleanup = handleVideoAspectRatioState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleVideoCaptionState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const titleStateCleanup = handleVideoTitleState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const playbackStateCleanup = handleVideoPlaybackState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const posterStateCleanup = handleVideoPosterState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const swapCleanup = handleVideoSwap({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const deleteCleanup = handleVideoDelete({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	return () => {
		blockResizeCleanup();
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
