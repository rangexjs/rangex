import { createBlockComponentPlacement } from "../../BlockComponentPlacement";
import type { ConfigureSeparatorParams } from "./ConfigureSeparator-types";
import { handleSeparatorInsertion } from "./HandleSeparatorInsertion";
import { handleSeparatorToolbarButtonState } from "./HandleSeparatorToolbarButtonState";

export const configureSeparator = ({
	editorPort,
	editorAPI,
}: ConfigureSeparatorParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const toolbarButtonStateCleanup = handleSeparatorToolbarButtonState({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleSeparatorInsertion({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
	};
};
