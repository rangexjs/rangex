import type { EditorAPI, GlyphFormatterInlineTag } from "rich-text-area";

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
