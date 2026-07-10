import { componentsName } from "../../Constants";
import type { ConfigureImageParams } from "./ConfigureImage-types";
import { handleImageAlignState } from "./HandleImageAlignState";
import { handleImageInsertion } from "./HandleImageInsertion";
import { handleImagePopoverAppearance } from "./HandleImagePopoverAppearance";
import { handleImageToolbarButtonState } from "./HandleImageToolbarButtonState";

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

	return () => {
		blockResize.unregisterComponent({ componentName: componentsName.image });
		toolbarButtonStateCleanup();
		insertionCleanup();
		popoverAppearanceCleanup();
		alignStateCleanup();
	};
};
