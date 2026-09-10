import { createBlockComponentPlacement } from "#engine-links";
import type { ConfigureBlockQuoteParams } from "./ConfigureBlockQuote-types";
import { handleBlockQuotePlacement } from "./HandleBlockQuotePlacement";
import { handleBlockQuoteToolbarButtonState } from "./HandleBlockQuoteToolbarButtonState";

export const configureBlockQuote = ({
	configPort,
	editorAPI,
}: ConfigureBlockQuoteParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const toolbarButtonStateCleanup = handleBlockQuoteToolbarButtonState({
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
		toolbarButtonStateCleanup();
		placementCleanup();
	};
};
