import { scrollMatchedRangeIntoView } from "../_Utilities";
import type { HandleNavigateToIndexParams } from "./HandleNavigateToIndex-types";

/** Navigates to a specific match index and scrolls it into view. */
export const handleNavigateToIndex = ({
	richTextEditorUI,
	editorAPI,
}: HandleNavigateToIndexParams) => {
	const findReplace = editorAPI.getFindReplace();

	const unsubscribe = richTextEditorUI.onNonCategorizedOperation((params) => {
		if (params.type !== "find-replace") {
			return;
		}

		const { action, navigateTo } = params;

		if (action !== "navigate-to-index") {
			return;
		}

		findReplace.stepTo({ index: navigateTo });

		scrollMatchedRangeIntoView({ findReplace });
	});

	return () => {
		unsubscribe();
	};
};
