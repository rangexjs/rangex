import type { ConfigureSymbolInsertionParams } from "./ConfigureSymbolInsertion-types";
import { handleSymbolInsertion } from "./HandleSymbolInsertion";

export const configureSymbolInsertion = ({
	richTextEditorUI,
	editorAPI,
}: ConfigureSymbolInsertionParams) => {
	const symbolInsertionCleanup = handleSymbolInsertion({
		richTextEditorUI,
		editorAPI,
	});

	return () => {
		symbolInsertionCleanup();
	};
};
