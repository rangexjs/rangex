import type { PlainTextScanStep } from "rich-text-area";
import type {
	ScanMarkdownCharsParams,
	ScanMarkdownCharsResult,
} from "./ScanMarkdownChars-types";

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
