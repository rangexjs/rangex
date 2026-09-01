import { createBlockComponentPlacement } from "../../BlockComponentPlacement";
import type { ConfigureEmptyMediaParams } from "./ConfigureEmptyMedia-types";
import { handleEmptyMediaInsertion } from "./HandleEmptyMediaInsertion";
import { handleEmptyMediaToolbarButtonState } from "./HandleEmptyMediaToolbarButtonState";
import { watchEmptyMedia } from "./WatchEmptyMedia";

export const configureEmptyMedia = ({
	configPort,
	editorAPI,
}: ConfigureEmptyMediaParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const toolbarButtonStateCleanup = handleEmptyMediaToolbarButtonState({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleEmptyMediaInsertion({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const watchCleanup = watchEmptyMedia({ configPort, editorAPI });

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
		watchCleanup();
	};
};
