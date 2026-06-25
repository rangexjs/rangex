import type { FindReplaceSearchResult } from "@rangex/rich-text-editor-ui";
import type { HandleResultsSyncParams } from "./HandleResultsSync-types";

/** Keeps the popover's result counters in sync with the engine on index or match changes. */
export const handleResultsSync = ({
	richTextEditorUI,
	editorAPI,
}: HandleResultsSyncParams) => {
	const findReplace = editorAPI.getFindReplace();

	const unsubscribeIndexChange = findReplace.onIndexChange(() => {
		const { currentIndex } = findReplace;

		richTextEditorUI.updateNonCategorizedButtonState({
			findReplace: { currentIndex },
		});
	});

	const unsubscribeMatchesChange = findReplace.onMatchesChange(() => {
		const { currentIndex, matchedRanges } = findReplace;
		const totalResults = matchedRanges.length;

		const results: FindReplaceSearchResult[] = matchedRanges.map(
			({ segmentText, matchStart, matchEnd }) => {
				return { segmentText, matchStart, matchEnd };
			},
		);

		richTextEditorUI.updateNonCategorizedButtonState({
			findReplace: { currentIndex, totalResults, results },
		});
	});

	return () => {
		unsubscribeIndexChange();
		unsubscribeMatchesChange();
	};
};
