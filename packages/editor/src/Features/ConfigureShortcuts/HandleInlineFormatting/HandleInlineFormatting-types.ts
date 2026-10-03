import type { EditorAPI, GlyphFormatterInlineTag } from "@rangex/core";

export interface InlineFormattingShortcut {
	code: string;
	shiftKey: boolean;
	tag: GlyphFormatterInlineTag;
}

export interface HandleInlineFormattingParams {
	editorAPI: EditorAPI;
}
