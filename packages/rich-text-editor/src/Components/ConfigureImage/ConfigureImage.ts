import { componentsName } from "../../Constants";
import type { ConfigureImageParams } from "./ConfigureImage-types";
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

	return () => {
		blockResize.unregisterComponent({ componentName: componentsName.image });
		toolbarButtonStateCleanup();
		insertionCleanup();
		popoverAppearanceCleanup();
	};
};
