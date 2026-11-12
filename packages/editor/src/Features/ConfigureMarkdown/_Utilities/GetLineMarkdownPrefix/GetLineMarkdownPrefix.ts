import { EditorRange, type PlainTextScanStep } from "@rangex/core";

import { getClosestContentLine } from "#engine-links";

import type {
	GetLineMarkdownPrefixParams,
	GetLineMarkdownPrefixResult,
	IsPrefixAtContentLineStartParams,
} from "./GetLineMarkdownPrefix-types";

const charLimit = 20;

/*
 * Scans backward from the cursor to the start of the current ContentLine, returning the
 * full line prefix (text + boundary point), or null if the line start isn't reached
 * within `charLimit` characters.
 */
export const getLineMarkdownPrefix = ({
	editorAPI,
	fromText,
	fromOffset,
}: GetLineMarkdownPrefixParams): GetLineMarkdownPrefixResult => {
	const { plainTextScanner } = editorAPI.createPlainTextScanner({
		fromNode: fromText,
		fromOffset,
		direction: "backward",
	});

	let lastStep: PlainTextScanStep | null = null;
	let reachedLineStart = true;

	let i = 0;

	for (const step of plainTextScanner) {
		if (i++ >= charLimit) {
			reachedLineStart = false;
			break;
		}

		lastStep = step;
	}

	if (!(reachedLineStart && lastStep)) {
		return null;
	}

	return lastStep;
};

/*
 * Returns whether the given line prefix starts at the very beginning of its ContentLine,
 * with no range-sensitive nodes before it.
 */
export const isPrefixAtContentLineStart = ({ prefix }: IsPrefixAtContentLineStartParams) => {
	const contentLine = getClosestContentLine({ fromNode: prefix.toText });

	if (!contentLine) {
		throw new Error("ContentLine not supposed to be null.");
	}

	const range = new EditorRange({
		fromNode: contentLine,
		fromOffset: 0,
		toNode: prefix.toText,
		toOffset: prefix.toOffset,
	});

	return !range.containsRangeSensitiveNode;
};
