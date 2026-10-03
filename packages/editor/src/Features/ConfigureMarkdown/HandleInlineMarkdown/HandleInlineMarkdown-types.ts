import type { EditorAPI, GlyphFormatterInlineTag } from "@rangex/core";

export interface InlineMarkdownMatch {
	tag: GlyphFormatterInlineTag;
	fullLength: number;
	contentText: string;
}

export type MatchInlineTriggerResult = InlineMarkdownMatch | null;

export interface CanApplyInlineTagParams {
	editorAPI: EditorAPI;
	tag: GlyphFormatterInlineTag;
}

export interface HandleInlineMarkdownParams {
	editorAPI: EditorAPI;
}
