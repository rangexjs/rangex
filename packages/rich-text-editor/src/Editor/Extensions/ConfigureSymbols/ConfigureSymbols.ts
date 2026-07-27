import type { ConfigureSymbolsParams } from "./ConfigureSymbols-types";
import { handleSymbolsInsertion } from "./HandleSymbolsInsertion";

export const configureSymbols = ({
	editorPort,
	editorAPI,
}: ConfigureSymbolsParams) => {
	const insertionCleanup = handleSymbolsInsertion({ editorPort, editorAPI });

	return () => {
		insertionCleanup();
	};
};
