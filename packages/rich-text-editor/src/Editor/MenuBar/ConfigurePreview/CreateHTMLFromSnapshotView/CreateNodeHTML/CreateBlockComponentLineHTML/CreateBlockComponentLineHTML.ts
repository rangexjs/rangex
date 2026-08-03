import { setAttributes } from "../_Utilities";
import type {
	CreateBlockComponentLineHTMLParams,
	CreateBlockComponentLineHTMLResult,
} from "./CreateBlockComponentLineHTML-types";

export const createBlockComponentLineHTML = ({
	blockComponentLineView,
	childNodes,
}: CreateBlockComponentLineHTMLParams): CreateBlockComponentLineHTMLResult => {
	const { namespaceURI, localName, attributes } = blockComponentLineView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
