import { EditorRange, type PlainTextScanStep } from "rich-text-area";
import { getClosestContentLine } from "../../../NodeQuery";
import type {
	GetLineMarkdownPrefixParams,
	GetLineMarkdownPrefixResult,
	IsPrefixAtContentLineStartParams,
	ScanMarkdownCharsParams,
	ScanMarkdownCharsResult,
} from "./Utilities-types";

const charLimit = 10;

/**
 * Scans backward from the cursor to the start of the current ContentLine, returning the
 * full line prefix (text + boundary point). Every block markdown trigger (heading, list,
 * ...) is short, so failing to reach the line start within `charLimit` characters means
 * the cursor isn't at a valid trigger position — returns null in that case.
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

export const isPrefixAtContentLineStart = ({
	prefix,
}: IsPrefixAtContentLineStartParams) => {
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

export const scanMarkdownChars = ({
	editorAPI,
	fromText,
	fromOffset,
	maxChars,
}: ScanMarkdownCharsParams): ScanMarkdownCharsResult => {
	const { plainTextScanner } = editorAPI.createPlainTextScanner({
		fromNode: fromText,
		fromOffset,
		direction: "backward",
	});

	let lastStep: PlainTextScanStep | null = null;
	let charsScanned = 0;

	for (const step of plainTextScanner) {
		if (charsScanned >= maxChars) {
			break;
		}

		lastStep = step;
		charsScanned++;
	}

	if (!lastStep) {
		return null;
	}

	return { step: lastStep, charsScanned };
};
