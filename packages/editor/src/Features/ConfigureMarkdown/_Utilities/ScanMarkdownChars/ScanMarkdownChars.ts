import type { PlainTextScanStep } from "@rangex/core";
import type {
	ScanMarkdownCharsParams,
	ScanMarkdownCharsResult,
} from "./ScanMarkdownChars-types";

/*
 * Scans backward from the cursor up to `maxChars` characters, returning the scanned text
 * step and how many characters were actually scanned, or null if nothing could be scanned.
 */
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
