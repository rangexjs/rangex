import { setAttributes } from "../_Utilities";
import type {
	CreateBlockNestedContextLineHTMLParams,
	CreateBlockNestedContextLineHTMLResult,
} from "./CreateBlockNestedContextLineHTML-types";

export const createBlockNestedContextLineHTML = ({
	blockNestedContextLineView,
	childNodes,
}: CreateBlockNestedContextLineHTMLParams): CreateBlockNestedContextLineHTMLResult => {
	const { namespaceURI, localName, attributes } = blockNestedContextLineView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
