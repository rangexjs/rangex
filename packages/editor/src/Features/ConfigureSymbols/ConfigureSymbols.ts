import type { ConfigureSymbolsParams } from "./ConfigureSymbols-types";
import { handleSymbolsInsertion } from "./HandleSymbolsInsertion";

export const configureSymbols = ({
	configPort,
	editorAPI,
}: ConfigureSymbolsParams) => {
	const insertionCleanup = handleSymbolsInsertion({ configPort, editorAPI });

	return () => {
		insertionCleanup();
	};
};
