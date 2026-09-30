import type { EditorAPI, EditorText, PlainTextScanStep } from "@rangex/core";

export interface ScanMarkdownCharsParams {
	editorAPI: EditorAPI;
	fromText: EditorText;
	fromOffset: number;
	maxChars: number;
}

export interface MarkdownCharsScan {
	step: PlainTextScanStep;
	charsScanned: number;
}

export type ScanMarkdownCharsResult = MarkdownCharsScan | null;
