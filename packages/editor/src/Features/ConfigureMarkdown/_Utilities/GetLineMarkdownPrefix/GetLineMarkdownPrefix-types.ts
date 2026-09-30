import type { EditorAPI, EditorText, PlainTextScanStep } from "@rangex/core";

export interface GetLineMarkdownPrefixParams {
	editorAPI: EditorAPI;
	fromText: EditorText;
	fromOffset: number;
}

export type GetLineMarkdownPrefixResult = PlainTextScanStep | null;

export interface IsPrefixAtContentLineStartParams {
	prefix: PlainTextScanStep;
}
