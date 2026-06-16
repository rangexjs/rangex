import { setAttributes } from "../_Utilities";
import type {
	CreateInlineNestedContextHTMLParams,
	CreateInlineNestedContextHTMLResult,
} from "./CreateInlineNestedContextHTML-types";

export const createInlineNestedContextHTML = ({
	inlineNestedContextView,
	childNodes,
}: CreateInlineNestedContextHTMLParams): CreateInlineNestedContextHTMLResult => {
	const { namespaceURI, localName, attributes } = inlineNestedContextView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
