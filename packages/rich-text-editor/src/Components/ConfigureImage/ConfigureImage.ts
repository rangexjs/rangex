import { componentsName } from "../../Constants";
import type { ConfigureImageParams } from "./ConfigureImage-types";
import { handleImageInsertion } from "./HandleImageInsertion";
import { handleImageToolbarButtonState } from "./HandleImageToolbarButtonState";

export const configureImage = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
	blockResize,
}: ConfigureImageParams) => {
	blockResize.registerResizableComponent({
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

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
	};
};
