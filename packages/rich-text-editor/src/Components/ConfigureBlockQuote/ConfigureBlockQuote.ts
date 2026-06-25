import type { ConfigureBlockQuoteParams } from "./ConfigureBlockQuote-types";
import { handleBlockQuoteInsertion } from "./HandleBlockQuoteInsertion";
import { handleBlockQuoteToolbarButtonState } from "./HandleBlockQuoteToolbarButtonState";

export const configureBlockQuote = ({
	richTextEditorUI,
	editorAPI,
	blockComponentPlacement,
}: ConfigureBlockQuoteParams) => {
	const toolbarButtonStateCleanup = handleBlockQuoteToolbarButtonState({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});
	const insertionCleanup = handleBlockQuoteInsertion({
		richTextEditorUI,
		editorAPI,
		blockComponentPlacement,
	});

	return () => {
		toolbarButtonStateCleanup();
		insertionCleanup();
	};
};
