import { componentsName } from "../../Constants";
import { getImageFigure, isImageEmpty } from "./_Utilities";
import type {
	ConfigureImageParams,
	ImageInternals,
} from "./ConfigureImage-types";
import { handleImageAlignState } from "./HandleImageAlignState";
import { handleImageAttrState } from "./HandleImageAttrState";
import { handleImageCaptionState } from "./HandleImageCaptionState";
import { handleImageDelete } from "./HandleImageDelete";
import { handleImageDrop } from "./HandleImageDrop";
import { handleImageDropzoneClick } from "./HandleImageDropzoneClick";
import { handleImageEditPopoverAppearance } from "./HandleImageEditPopoverAppearance";
import { handleImageInsertion } from "./HandleImageInsertion";
import { handleImageSwap } from "./HandleImageSwap";
import { handleImageSwapButtonOpen } from "./HandleImageSwapButtonOpen";
import { handleImageSwapPopoverClose } from "./HandleImageSwapPopoverClose";
import { handleImageToolbarButtonState } from "./HandleImageToolbarButtonState";

// TODO: file uploads are inlined as base64 data URLs (see readFileAsDataURL in
// ConfigureImage/_Utilities) instead of going through any upload endpoint or blob storage.
// This embeds the full image bytes directly in the document and in every snapshot/undo
// boundary. It works for now but isn't viable long term — needs a pluggable upload
// mechanism (consumer-supplied endpoint/blob storage) eventually. configureVideo currently
// mirrors this same approach, where the problem is much more pronounced.
export const configureImage = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
	blockResize,
	blockPopoverAppearanceHandler,
}: ConfigureImageParams) => {
	const internals: ImageInternals = { currentImageFigure: null };

	const blockResizeCleanup = blockResize.registerComponent({
		handleX: 16,
		canShow({ blockNestedContext }) {
			if (blockNestedContext.$$componentName !== componentsName.image) {
				return false;
			}

			const figure = getImageFigure({ blockNestedContext });

			return !isImageEmpty({ figure });
		},
	});

	const toolbarButtonStateCleanup = handleImageToolbarButtonState({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleImageInsertion({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	const { getCurrentBlock, cleanup: popoverAppearanceCleanup } =
		handleImageEditPopoverAppearance({
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

	const dropzoneClickCleanup = handleImageDropzoneClick({
		richTextEditorUI,
		editorAPI,
		internals,
	});

	const dropCleanup = handleImageDrop({ editorAPI });

	const swapButtonOpenCleanup = handleImageSwapButtonOpen({
		richTextEditorUI,
		getCurrentBlock,
		internals,
	});

	const swapCleanup = handleImageSwap({
		richTextEditorUI,
		editorAPI,
		internals,
	});

	const swapPopoverCloseCleanup = handleImageSwapPopoverClose({
		richTextEditorUI,
		internals,
	});

	const deleteCleanup = handleImageDelete({
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
		attrStateCleanup();
		captionStateCleanup();
		dropzoneClickCleanup();
		dropCleanup();
		swapButtonOpenCleanup();
		swapCleanup();
		swapPopoverCloseCleanup();
		deleteCleanup();
	};
};
