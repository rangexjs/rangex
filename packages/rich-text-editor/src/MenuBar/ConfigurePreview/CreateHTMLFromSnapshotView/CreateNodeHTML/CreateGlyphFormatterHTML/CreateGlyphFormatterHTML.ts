import type { GlyphFormatterExtendedChildView } from "rich-text-area";
import { glyphFormatterInlineTagViewName } from "rich-text-area";
import { setAttributes } from "../_Utilities";
import { createGlyphFormatterInlineTagHTML } from "../CreateGlyphFormatterInlineTagHTML";
import type {
	CreateGlyphFormatterHTMLParams,
	CreateGlyphFormatterHTMLResult,
} from "./CreateGlyphFormatterHTML-types";

export const createGlyphFormatterHTML = ({
	glyphFormatterView,
	toDOM,
}: CreateGlyphFormatterHTMLParams): CreateGlyphFormatterHTMLResult => {
	const { namespaceURI, localName, attributes, childNodes } =
		glyphFormatterView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });

	const childToDOM = (
		child: GlyphFormatterExtendedChildView,
	): HTMLElement | Text | null => {
		if (child.type === glyphFormatterInlineTagViewName) {
			const inlineTagChildNodes = child.childNodes
				.map((grandchild) => childToDOM(grandchild))
				.filter((nullableChild) => nullableChild !== null);

			return createGlyphFormatterInlineTagHTML({
				glyphFormatterInlineTagView: child,
				childNodes: inlineTagChildNodes,
			});
		}

		const result = toDOM(child);

		if (
			result === null ||
			result instanceof Text ||
			result instanceof HTMLElement
		) {
			return result;
		}

		throw new Error(
			`[CreateGlyphFormatterHTML] Unexpected child type: ${result.constructor.name}`,
		);
	};

	for (const child of childNodes) {
		const childNode = childToDOM(child);

		if (childNode !== null) {
			el.appendChild(childNode);
		}
	}

	return el;
};
