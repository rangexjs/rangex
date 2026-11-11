import type { HandleSearchChangeParams } from "./HandleSearchChange-types";

/*
 * Updates the engine's search criteria whenever the user changes the find options.
 */
export const handleSearchChange = ({ configPort, editorAPI }: HandleSearchChangeParams) => {
	const findReplace = editorAPI.getFindReplace();

	const unsubscribe = configPort.onSearch(({ pattern, includeNonEditableContent }) => {
		findReplace.setCriteria({
			pattern,
			nonEditableIncluded: includeNonEditableContent,
		});
	});

	return () => {
		unsubscribe();
	};
};
