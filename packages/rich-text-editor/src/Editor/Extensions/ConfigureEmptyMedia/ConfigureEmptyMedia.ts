import { createBlockComponentPlacement } from "../../BlockComponentPlacement";
import type { ConfigureEmptyMediaParams } from "./ConfigureEmptyMedia-types";
import { handleEmptyMediaInsertion } from "./HandleEmptyMediaInsertion";
import { handleEmptyMediaToolbarButtonState } from "./HandleEmptyMediaToolbarButtonState";
import { watchEmptyMedia } from "./WatchEmptyMedia";

export const configureEmptyMedia = ({
	editorPort,
	editorAPI,
}: ConfigureEmptyMediaParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const toolbarButtonStateCleanup = handleEmptyMediaToolbarButtonState({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleEmptyMediaInsertion({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	const watchCleanup = watchEmptyMedia({ editorPort, editorAPI });

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
		watchCleanup();
	};
};
