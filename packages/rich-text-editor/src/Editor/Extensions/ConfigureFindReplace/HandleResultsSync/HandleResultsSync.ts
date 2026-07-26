import type { FindReplaceResultsState } from "#adapters";
import type { HandleResultsSyncParams } from "./HandleResultsSync-types";

/** Keeps the popover's result counters in sync with the engine on index or match changes. */
export const handleResultsSync = ({
	editorPort,
	editorAPI,
}: HandleResultsSyncParams) => {
	const findReplace = editorAPI.getFindReplace();

	const buildResultsState = (): FindReplaceResultsState => {
		const { currentIndex, matchedRanges } = findReplace;

		const results = matchedRanges.map(
			({ segmentText, matchStart, matchEnd }) => {
				return { segmentText, matchStart, matchEnd };
			},
		);

		return { currentIndex, totalResults: results.length, results };
	};

	const unsubscribeIndexChange = findReplace.onIndexChange(() => {
		editorPort.updateState({ results: buildResultsState() });
	});

	const unsubscribeMatchesChange = findReplace.onMatchesChange(() => {
		editorPort.updateState({ results: buildResultsState() });
	});

	return () => {
		unsubscribeIndexChange();
		unsubscribeMatchesChange();
	};
};
