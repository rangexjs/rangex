import { componentsName } from "../../Constants";
import type { ConfigureImageParams } from "./ConfigureImage-types";
import { handleImageAlignState } from "./HandleImageAlignState";
import { handleImageAltTextState } from "./HandleImageAltTextState";
import { handleImageAspectRatioState } from "./HandleImageAspectRatioState";
import { handleImageCaptionState } from "./HandleImageCaptionState";
import { handleImageDelete } from "./HandleImageDelete";
import { handleImageInsertion } from "./HandleImageInsertion";
import { handleImageObjectFitState } from "./HandleImageObjectFitState";
import { handleImagePopoverAppearance } from "./HandleImagePopoverAppearance";
import { handleImageSwap } from "./HandleImageSwap";
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
	blockResize.registerComponent({
		componentName: componentsName.image,
		handleX: 16,
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

	const popoverAppearanceCleanup = handleImagePopoverAppearance({
		richTextEditorUI,
		blockPopoverAppearanceHandler,
	});

	const alignStateCleanup = handleImageAlignState({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	const objectFitStateCleanup = handleImageObjectFitState({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	const aspectRatioStateCleanup = handleImageAspectRatioState({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	const captionStateCleanup = handleImageCaptionState({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	const altTextStateCleanup = handleImageAltTextState({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	const swapCleanup = handleImageSwap({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	const deleteCleanup = handleImageDelete({
		richTextEditorUI,
		editorAPI,
		blockPopoverAppearanceHandler,
	});

	return () => {
		blockResize.unregisterComponent({ componentName: componentsName.image });
		toolbarButtonStateCleanup();
		insertionCleanup();
		popoverAppearanceCleanup();
		alignStateCleanup();
		objectFitStateCleanup();
		aspectRatioStateCleanup();
		captionStateCleanup();
		altTextStateCleanup();
		swapCleanup();
		deleteCleanup();
	};
};
