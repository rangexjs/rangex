import { createBlockComponentPlacement } from "#engine-links";
import type { ConfigureSeparatorParams } from "./ConfigureSeparator-types";
import { handleSeparatorPlacement } from "./HandleSeparatorPlacement";
import { handleSeparatorPlacementState } from "./HandleSeparatorPlacementState";

/*
 * Wires up separator toolbar button state and placement handling, returning a cleanup function.
 */
export const configureSeparator = ({
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureSeparatorParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const placementStateCleanup = handleSeparatorPlacementState({
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
		placementStateCleanup();
		insertionCleanup();
	};
};
