import { createBlockComponentPlacement } from "#engine-links";
import type { ConfigureSourcePlaceholderParams } from "./ConfigureSourcePlaceholder-types";
import { handleSourcePlaceholderInsertion } from "./HandleSourcePlaceholderInsertion";
import { handleSourcePlaceholderPlacementState } from "./HandleSourcePlaceholderPlacementState";
import { watchSourcePlaceholder } from "./WatchSourcePlaceholder";

/*
 * Wires up the source placeholder placeholder component: toolbar button state, insertion, and
 * watching placed blocks to resolve their final media source. Returns a cleanup function.
 */
export const configureSourcePlaceholder = ({
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureSourcePlaceholderParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const placementStateCleanup = handleSourcePlaceholderPlacementState({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleSourcePlaceholderInsertion({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const watchCleanup = watchSourcePlaceholder({
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
