import { setAttributes } from "../_Utilities";
import type {
	CreateHTMLLayoutHTMLParams,
	CreateHTMLLayoutHTMLResult,
} from "./CreateHTMLLayoutHTML-types";

export const createHTMLLayoutHTML = ({
	htmlLayoutView,
	childNodes,
}: CreateHTMLLayoutHTMLParams): CreateHTMLLayoutHTMLResult => {
	const { namespaceURI, localName, attributes } = htmlLayoutView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
