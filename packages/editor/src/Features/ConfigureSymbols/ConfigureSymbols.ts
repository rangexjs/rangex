import type { ConfigureSymbolsParams } from "./ConfigureSymbols-types";
import { handleSymbolsInsertion } from "./HandleSymbolsInsertion";

/*
 * Wires up symbol insertion handling, returning a cleanup function.
 */
export const configureSymbols = ({ configPort, editorAPI }: ConfigureSymbolsParams) => {
	const insertionCleanup = handleSymbolsInsertion({ configPort, editorAPI });

	return () => {
		insertionCleanup();
	};
};
