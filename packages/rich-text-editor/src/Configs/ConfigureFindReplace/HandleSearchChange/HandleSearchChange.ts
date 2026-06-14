import { buildFindReplacePattern } from "../_Utilities";
import type { HandleSearchChangeParams } from "./HandleSearchChange-types";

/** Updates the engine's search criteria whenever the user changes the find options. */
export const handleSearchChange = ({
	richTextEditorUI,
	editorAPI,
}: HandleSearchChangeParams) => {
	const findReplace = editorAPI.getFindReplace();

	richTextEditorUI.onNonCategorizedOperation((params) => {
		if (params.type !== "find-replace") {
			return;
		}

		const {
			action,
			findText,
			includeNonEditableContent,
			matchCase,
			useRegex,
			wholeWord,
		} = params;

		if (action !== "search-change") {
			return;
		}

		const pattern = buildFindReplacePattern({
			findText,
			matchCase,
			useRegex,
			wholeWord,
		});

		findReplace.setCriteria({
			pattern,
			nonEditableIncluded: includeNonEditableContent,
		});
	});
};
