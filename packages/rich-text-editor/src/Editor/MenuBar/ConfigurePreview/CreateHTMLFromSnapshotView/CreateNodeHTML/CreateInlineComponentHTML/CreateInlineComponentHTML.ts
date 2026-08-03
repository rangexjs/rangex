import { setAttributes } from "../_Utilities";
import type {
	CreateInlineComponentHTMLParams,
	CreateInlineComponentHTMLResult,
} from "./CreateInlineComponentHTML-types";

export const createInlineComponentHTML = ({
	inlineComponentView,
	childNodes,
}: CreateInlineComponentHTMLParams): CreateInlineComponentHTMLResult => {
	const { namespaceURI, localName, attributes } = inlineComponentView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
