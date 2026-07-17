import { componentsName } from "../../Constants";
import type {
	ConfigureImageParams,
	ImageInternals,
} from "./ConfigureImage-types";
import { handleImageAlignState } from "./HandleImageAlignState";
import { handleImageAttrState } from "./HandleImageAttrState";
import { handleImageCaptionState } from "./HandleImageCaptionState";
import { handleImageDelete } from "./HandleImageDelete";
import { handleImageInsertion } from "./HandleImageInsertion";
import { handleImagePopoverAppearance } from "./HandleImagePopoverAppearance";
import { handleImageSwap } from "./HandleImageSwap";
import { handleImageSwapPopoverToggle } from "./HandleImageSwapPopoverToggle";

// TODO: file uploads are inlined as base64 data URLs (see uploadMediaFile in
// src/Editor/_Utilities) instead of going through any upload endpoint or blob
// storage. This embeds the full image bytes directly in the document and in every
// snapshot/undo boundary. It works for now but isn't viable long term — needs a pluggable
// upload mechanism (consumer-supplied endpoint/blob storage) eventually. configureVideo
// currently mirrors this same approach, where the problem is much more pronounced.
export const configureImage = ({
	richTextEditorUI,
	editorAPI,
	blockResize,
	blockPopoverAppearanceHandler,
	onMediaResolve,
}: ConfigureImageParams) => {
	const internals: ImageInternals = { currentImageFigure: null };

	const blockResizeCleanup = blockResize.registerComponent({
		handleX: 16,
		canShow({ blockNestedContext }) {
			return blockNestedContext.$$componentName === componentsName.image;
		},
	});

	const insertionCleanup = handleImageInsertion({
		editorAPI,
		onMediaResolve,
	});

	const { getCurrentBlock, cleanup: popoverAppearanceCleanup } =
		handleImagePopoverAppearance({
			richTextEditorUI,
			blockPopoverAppearanceHandler,
		});

	const alignStateCleanup = handleImageAlignState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const attrStateCleanup = handleImageAttrState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const captionStateCleanup = handleImageCaptionState({
		richTextEditorUI,
		editorAPI,
		getCurrentBlock,
	});

	const swapPopoverToggleCleanup = handleImageSwapPopoverToggle({
		richTextEditorUI,
		getCurrentBlock,
		internals,
	});

	const swapCleanup = handleImageSwap({
		richTextEditorUI,
		editorAPI,
		internals,
	});

	const deleteCleanup = handleImageDelete({
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
