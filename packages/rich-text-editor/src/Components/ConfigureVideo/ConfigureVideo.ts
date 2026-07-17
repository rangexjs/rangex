import { componentsName } from "../../Constants";
import type {
	ConfigureVideoParams,
	VideoInternals,
} from "./ConfigureVideo-types";
import { handleVideoAlignState } from "./HandleVideoAlignState";
import { handleVideoAttrState } from "./HandleVideoAttrState";
import { handleVideoCaptionState } from "./HandleVideoCaptionState";
import { handleVideoDelete } from "./HandleVideoDelete";
import { handleVideoInsertion } from "./HandleVideoInsertion";
import { handleVideoPopoverAppearance } from "./HandleVideoPopoverAppearance";
import { handleVideoSwap } from "./HandleVideoSwap";
import { handleVideoSwapPopoverToggle } from "./HandleVideoSwapPopoverToggle";

// TODO: file uploads are inlined as base64 data URLs (see uploadMediaFile in
// src/_Utilities) instead of going through any upload endpoint or blob
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
		handleVideoPopoverAppearance({
			richTextEditorUI,
			blockPopoverAppearanceHandler,
		});

	const alignStateCleanup = handleVideoAlignState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const attrStateCleanup = handleVideoAttrState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleVideoCaptionState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const swapPopoverToggleCleanup = handleVideoSwapPopoverToggle({
		richTextEditorUI,
		getCurrentBlock,
		internals,
	});

	const swapCleanup = handleVideoSwap({
		richTextEditorUI,
		editorAPI,
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
		attrStateCleanup();
		captionStateCleanup();
		swapPopoverToggleCleanup();
		swapCleanup();
		deleteCleanup();
	};
};
