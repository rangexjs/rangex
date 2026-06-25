import { buildFindReplacePattern } from "../_Utilities";
import type { HandleFindReplaceActivationParams } from "./HandleFindReplaceActivation-types";

/** Ties find-replace engine activation to the popover lifecycle, seeding criteria on open. */
export const handleFindReplaceActivation = ({
	richTextEditorUI,
	editorAPI,
}: HandleFindReplaceActivationParams) => {
	const findReplace = editorAPI.getFindReplace();

	const unsubscribe = richTextEditorUI.onNonCategorizedOperation((params) => {
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

		if (action === "popover-open") {
			findReplace.enable();

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
		}

		if (action === "popover-closed") {
			findReplace.disable();
		}
	});

	return () => {
		unsubscribe();
	};
};
