import { EditorRange } from "rich-text-area";
import type { ScrollMatchedRangeIntoViewParams } from "./ScrollMatchedRangeIntoView-types";

/*
 * Scrolls the current find-replace match into view.
 */
export const scrollMatchedRangeIntoView = ({
	findReplace,
}: ScrollMatchedRangeIntoViewParams) => {
	const matchedRange = findReplace.matchedRanges.at(findReplace.currentIndex);

	if (!matchedRange) {
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
};
