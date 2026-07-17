import { setAttributes } from "../_Utilities";
import type {
	CreateListHTMLParams,
	CreateListHTMLResult,
} from "./CreateListHTML-types";

export const createListHTML = ({
	listView,
	childNodes,
}: CreateListHTMLParams): CreateListHTMLResult => {
	const { namespaceURI, localName, attributes } = listView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
