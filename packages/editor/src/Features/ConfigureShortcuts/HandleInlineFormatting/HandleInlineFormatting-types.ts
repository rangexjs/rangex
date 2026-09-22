import type { EditorAPI, GlyphFormatterInlineTag } from "rich-text-area";

export interface InlineFormattingShortcut {
	code: string;
	shiftKey: boolean;
	tag: GlyphFormatterInlineTag;
}

export interface HandleInlineFormattingParams {
	editorAPI: EditorAPI;
}
