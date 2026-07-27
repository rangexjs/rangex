import { createBlockComponentPlacement } from "../../BlockComponentPlacement";
import type { ConfigureListParams } from "./ConfigureList-types";
import { handleListInsertion } from "./HandleListInsertion";
import { handleListToolbarButtonState } from "./HandleListToolbarButtonState";

export const configureList = ({
	editorPort,
	editorAPI,
}: ConfigureListParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const toolbarButtonStateCleanup = handleListToolbarButtonState({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleListInsertion({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
	};
};
