import { setAttributes } from "../_Utilities";
import type {
	CreateBlockNestedContextHTMLParams,
	CreateBlockNestedContextHTMLResult,
} from "./CreateBlockNestedContextHTML-types";

export const createBlockNestedContextHTML = ({
	blockNestedContextView,
	childNodes,
}: CreateBlockNestedContextHTMLParams): CreateBlockNestedContextHTMLResult => {
	const { namespaceURI, localName, attributes } = blockNestedContextView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
