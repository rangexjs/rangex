import { createBlockComponentPlacement } from "#engine-links";
import type { ConfigureEmptyMediaParams } from "./ConfigureEmptyMedia-types";
import { handleEmptyMediaInsertion } from "./HandleEmptyMediaInsertion";
import { handleEmptyMediaPlacementState } from "./HandleEmptyMediaPlacementState";
import { watchEmptyMedia } from "./WatchEmptyMedia";

/*
 * Wires up the empty media placeholder component: toolbar button state, insertion, and
 * watching placed blocks to resolve their final media source. Returns a cleanup function.
 */
export const configureEmptyMedia = ({
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureEmptyMediaParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const placementStateCleanup = handleEmptyMediaPlacementState({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleEmptyMediaInsertion({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const watchCleanup = watchEmptyMedia({
		adapterBus,
		configPort,
		editorAPI,
	});

	return () => {
		placementStateCleanup();
		insertionCleanup();
		watchCleanup();
	};
};
