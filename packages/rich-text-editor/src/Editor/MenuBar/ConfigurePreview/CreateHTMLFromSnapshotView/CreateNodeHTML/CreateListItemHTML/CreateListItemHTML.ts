import { setAttributes } from "../_Utilities";
import type {
	CreateListItemHTMLParams,
	CreateListItemHTMLResult,
} from "./CreateListItemHTML-types";

export const createListItemHTML = ({
	listItemView,
	childNodes,
}: CreateListItemHTMLParams): CreateListItemHTMLResult => {
	const { namespaceURI, localName, attributes } = listItemView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
