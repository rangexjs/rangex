import { createBlockComponentPlacement } from "#engine-links";
import type { ConfigureBlockQuoteParams } from "./ConfigureBlockQuote-types";
import { handleBlockQuotePlacement } from "./HandleBlockQuotePlacement";
import { handleBlockQuotePlacementState } from "./HandleBlockQuotePlacementState";

/*
 * Wires up block quote toolbar button state and placement handling, returning a cleanup function.
 */
export const configureBlockQuote = ({
	configPort,
	editorAPI,
}: ConfigureBlockQuoteParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const placementStateCleanup = handleBlockQuotePlacementState({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const placementCleanup = handleBlockQuotePlacement({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	return () => {
		placementStateCleanup();
		placementCleanup();
	};
};
