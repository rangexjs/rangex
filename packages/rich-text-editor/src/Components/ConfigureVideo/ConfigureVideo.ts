import { componentsName } from "../../Constants";
import type {
	ConfigureVideoParams,
	VideoInternals,
} from "./ConfigureVideo-types";
import { handleVideoAlignState } from "./HandleVideoAlignState";
import { handleVideoAspectRatioState } from "./HandleVideoAspectRatioState";
import { handleVideoCaptionState } from "./HandleVideoCaptionState";
import { handleVideoDelete } from "./HandleVideoDelete";
import { handleVideoEditPopoverAppearance } from "./HandleVideoEditPopoverAppearance";
import { handleVideoInsertion } from "./HandleVideoInsertion";
import { handleVideoObjectFitState } from "./HandleVideoObjectFitState";
import { handleVideoPlaybackState } from "./HandleVideoPlaybackState";
import { handleVideoPosterState } from "./HandleVideoPosterState";
import { handleVideoSwap } from "./HandleVideoSwap";
import { handleVideoSwapButtonOpen } from "./HandleVideoSwapButtonOpen";
import { handleVideoSwapPopoverClose } from "./HandleVideoSwapPopoverClose";
import { handleVideoTitleState } from "./HandleVideoTitleState";

// TODO: file uploads are inlined as base64 data URLs (see uploadMediaFile in
// ConfigureEmptyMedia/_Utilities) instead of going through any upload endpoint or blob
// storage. This embeds the full file bytes directly in the document and in every
// snapshot/undo boundary. It works for now but isn't viable long term — needs a pluggable
// upload mechanism (consumer-supplied endpoint/blob storage) eventually.
export const configureVideo = ({
	richTextEditorUI,
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
		handleVideoEditPopoverAppearance({
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

	const swapButtonOpenCleanup = handleVideoSwapButtonOpen({
		richTextEditorUI,
		getCurrentBlock,
		internals,
	});

	const swapCleanup = handleVideoSwap({
		richTextEditorUI,
		editorAPI,
		internals,
	});

	const swapPopoverCloseCleanup = handleVideoSwapPopoverClose({
		richTextEditorUI,
		internals,
	});

	const deleteCleanup = handleVideoDelete({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	return () => {
		blockResizeCleanup();
		insertionCleanup();
		popoverAppearanceCleanup();
		alignStateCleanup();
		objectFitStateCleanup();
		aspectRatioStateCleanup();
		captionStateCleanup();
		titleStateCleanup();
		playbackStateCleanup();
		posterStateCleanup();
		swapButtonOpenCleanup();
		swapCleanup();
		swapPopoverCloseCleanup();
		deleteCleanup();
	};
};
