import { createBlockComponentPlacement } from "../../BlockComponentPlacement";
import type { ConfigureBlockQuoteParams } from "./ConfigureBlockQuote-types";
import { handleBlockQuoteInsertion } from "./HandleBlockQuoteInsertion";
import { handleBlockQuoteToolbarButtonState } from "./HandleBlockQuoteToolbarButtonState";

export const configureBlockQuote = ({
	editorPort,
	editorAPI,
}: ConfigureBlockQuoteParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const toolbarButtonStateCleanup = handleBlockQuoteToolbarButtonState({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	const insertionCleanup = handleBlockQuoteInsertion({
		editorPort,
		editorAPI,
		blockComponentPlacement,
	});

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
	};
};
