import { beamTextRole, contentLineRole } from "@rangex/core";

import { getClosestBlockLevelLine } from "../../NodeQuery";
import type {
	InsertBlockLinesParams,
	ReplaceContentLineIfNeededParams,
	ReplaceContentLineIfNeededResult,
} from "./InsertBlockLines-types";

/**
 * If the {@link shouldReplaceContentLineIfEmpty} is true and {@link blockLevelLine} is an empty ContentLine,
 * then replaces {@link blockLevelLine} with the {@link lines}'s first Line
 */
const replaceContentLineIfNeeded = ({
	blockLevelLine,
	lines,
	shouldReplaceContentLineIfEmpty,
}: ReplaceContentLineIfNeededParams): ReplaceContentLineIfNeededResult => {
	if (!(shouldReplaceContentLineIfEmpty && blockLevelLine.$$editorRole === contentLineRole)) {
		return { updatedLine: blockLevelLine, updatedLines: lines };
	}

	const { $$firstChild } = blockLevelLine;

	if (!$$firstChild) {
		throw new Error("FirstChild can't be null.");
	}

	const [firstLine, ...restOfTheLines] = lines;

	if ($$firstChild.$$editorRole === beamTextRole) {
		blockLevelLine.$$replaceWith(firstLine);

		return { updatedLine: firstLine, updatedLines: restOfTheLines };
	}

	return { updatedLine: blockLevelLine, updatedLines: lines };
};

/**
 * Inserts {@link lines} after the closest block-level line ancestor of {@link fromNode}.
 * If the ancestor is an empty ContentLine and {@link shouldReplaceContentLineIfEmpty} is true,
 * it is replaced by the first of the inserted lines instead of inserting after it.
 */
export const insertBlockLines = ({
	fromNode,
	lines,
	shouldReplaceContentLineIfEmpty,
}: InsertBlockLinesParams) => {
	if (!lines.length) {
		throw new Error("Lines can't be empty.");
	}

	const blockLevelLine = getClosestBlockLevelLine({ fromNode });

	if (!blockLevelLine) {
		throw new Error(
			"FromNode must contained by a multi-line ScopedEditable in order to insert lines.",
		);
	}

	const { updatedLine, updatedLines } = replaceContentLineIfNeeded({
		blockLevelLine,
		lines,
		shouldReplaceContentLineIfEmpty,
	});

	if (!updatedLines.length) {
		return;
	}

	updatedLine.$$after(...updatedLines);
};
