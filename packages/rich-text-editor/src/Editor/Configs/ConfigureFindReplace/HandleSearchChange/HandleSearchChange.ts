import type { HandleSearchChangeParams } from "./HandleSearchChange-types";

/** Updates the engine's search criteria whenever the user changes the find options. */
export const handleSearchChange = ({
	richTextEditorUI,
	editorAPI,
}: HandleSearchChangeParams) => {
	const findReplace = editorAPI.getFindReplace();

	const unsubscribe = richTextEditorUI.onNonCategorizedOperation((params) => {
		if (params.type !== "find-replace") {
			return;
		}

		const { action, pattern, includeNonEditableContent } = params;

		if (action !== "search-change") {
			return;
		}

		findReplace.setCriteria({
			pattern,
			nonEditableIncluded: includeNonEditableContent,
		});
	});

	return () => {
		unsubscribe();
	};
};
