import type { GlyphFormatterInlineTagView } from "rich-text-area";

export interface CreateGlyphFormatterInlineTagHTMLParams {
	glyphFormatterInlineTagView: GlyphFormatterInlineTagView;
	childNodes: (HTMLElement | Text)[];
}

export type CreateGlyphFormatterInlineTagHTMLResult = HTMLElement;
