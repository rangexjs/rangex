import type { ConfigureListParams } from "./ConfigureList-types";
import { handleListInsertion } from "./HandleListInsertion";
import { handleListToolbarButtonState } from "./HandleListToolbarButtonState";

export const configureList = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: ConfigureListParams) => {
	const toolbarButtonStateCleanup = handleListToolbarButtonState({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleListInsertion({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
	};
};
