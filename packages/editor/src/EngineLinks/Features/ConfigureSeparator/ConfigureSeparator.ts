import { createBlockComponentPlacement } from "../../BlockComponentPlacement";
import type { ConfigureSeparatorParams } from "./ConfigureSeparator-types";
import { handleSeparatorPlacement } from "./HandleSeparatorPlacement";
import { handleSeparatorToolbarButtonState } from "./HandleSeparatorToolbarButtonState";

export const configureSeparator = ({
	configPort,
	editorAPI,
}: ConfigureSeparatorParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const toolbarButtonStateCleanup = handleSeparatorToolbarButtonState({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleSeparatorPlacement({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
	};
};
