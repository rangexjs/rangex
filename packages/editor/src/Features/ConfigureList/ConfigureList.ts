import { createBlockComponentPlacement } from "#engine-links";
import type { ConfigureListParams } from "./ConfigureList-types";
import { handleListPlacement } from "./HandleListPlacement";
import { handleListToolbarButtonState } from "./HandleListToolbarButtonState";

/*
 * Wires up list toolbar button state and placement handling, returning a cleanup function.
 */
export const configureList = ({
	configPort,
	editorAPI,
}: ConfigureListParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const toolbarButtonStateCleanup = handleListToolbarButtonState({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const placementCleanup = handleListPlacement({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	return () => {
		toolbarButtonStateCleanup();
		placementCleanup();
	};
};
