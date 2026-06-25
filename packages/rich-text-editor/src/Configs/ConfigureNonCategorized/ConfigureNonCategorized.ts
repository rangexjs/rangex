import type { ConfigureNonCategorizedParams } from "./ConfigureNonCategorized-types";
import { handleNonCategorizedOperation } from "./HandleNonCategorizedOperation";

export const configureNonCategorized = ({
	richTextEditorUI,
	editorAPI,
}: ConfigureNonCategorizedParams) => {
	const nonCategorizedOperationCleanup = handleNonCategorizedOperation({
		richTextEditorUI,
		editorAPI,
	});

	return () => {
		nonCategorizedOperationCleanup();
	};
};
