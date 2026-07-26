import { scrollMatchedRangeIntoView } from "../_Utilities";
import type { HandleNavigateToIndexParams } from "./HandleNavigateToIndex-types";

/** Navigates to a specific match index and scrolls it into view. */
export const handleNavigateToIndex = ({
	editorPort,
	editorAPI,
}: HandleNavigateToIndexParams) => {
	const findReplace = editorAPI.getFindReplace();

	const unsubscribe = editorPort.onNavigateToIndex(({ index }) => {
		findReplace.stepTo({ index });

		scrollMatchedRangeIntoView({ findReplace });
	});

	return () => {
		unsubscribe();
	};
};
