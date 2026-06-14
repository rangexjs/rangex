import { EditorRange } from "rich-text-area";
import type { HandleNavigateToIndexParams } from "./HandleNavigateToIndex-types";

/** Navigates to a specific match index and scrolls it into view. */
export const handleNavigateToIndex = ({
	richTextEditorUI,
	editorAPI,
}: HandleNavigateToIndexParams) => {
	const findReplace = editorAPI.getFindReplace();

	richTextEditorUI.onNonCategorizedOperation((params) => {
		if (params.type !== "find-replace") {
			return;
		}

		const { action, navigateTo } = params;

		if (action !== "navigate-to-index") {
			return;
		}

		findReplace.stepTo({ index: navigateTo });

		const { matchedRanges } = findReplace;

		const matchedRange = matchedRanges.at(navigateTo);

		if (!matchedRange) {
			console.warn(`MatchedRange wasn't found at index ${navigateTo}.`);
			return;
		}

		const { fromText, fromOffset, toText, toOffset } = matchedRange;

		const range = new EditorRange({
			fromNode: fromText,
			fromOffset,
			toNode: toText,
			toOffset,
		});

		range.scrollIntoView({ block: "nearest", behavior: "smooth" });
	});
};
