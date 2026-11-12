import type { HandleResultsSyncParams } from "./HandleResultsSync-types";

/*
 * Keeps the popover's result counters in sync with the engine on index or match changes.
 */
export const handleResultsSync = ({ configPort, editorAPI }: HandleResultsSyncParams) => {
	const findReplace = editorAPI.getFindReplace();

	const unsubscribeIndexChange = findReplace.onIndexChange(() => {
		configPort.updateState({ currentIndex: findReplace.currentIndex });
	});

	const unsubscribeMatchesChange = findReplace.onMatchesChange(() => {
		const results = findReplace.matchedRanges.map(({ segmentText, matchStart, matchEnd }) => {
			return { segmentText, matchStart, matchEnd };
		});

		configPort.updateState({
			currentIndex: findReplace.currentIndex,
			results,
		});
	});

	return () => {
		unsubscribeIndexChange();
		unsubscribeMatchesChange();
	};
};
