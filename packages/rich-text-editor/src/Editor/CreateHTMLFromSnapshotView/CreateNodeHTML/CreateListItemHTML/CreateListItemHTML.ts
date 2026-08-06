import { setAttributes } from "../_Utilities";
import type {
	CreateListItemHTMLParams,
	CreateListItemHTMLResult,
} from "./CreateListItemHTML-types";

export const createListItemHTML = ({
	listItemView,
	childNodes,
	storageMap,
}: CreateListItemHTMLParams): CreateListItemHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } = listItemView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
