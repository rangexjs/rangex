import type {
	CreateGlyphFormatterInlineTagHTMLParams,
	CreateGlyphFormatterInlineTagHTMLResult,
} from "./CreateGlyphFormatterInlineTagHTML-types";

export const createGlyphFormatterInlineTagHTML = ({
	glyphFormatterInlineTagView,
	childNodes,
}: CreateGlyphFormatterInlineTagHTMLParams): CreateGlyphFormatterInlineTagHTMLResult => {
	const { namespaceURI, localName } = glyphFormatterInlineTagView;
	const el = document.createElementNS(namespaceURI, localName);

	el.append(...childNodes);

	return el;
};
