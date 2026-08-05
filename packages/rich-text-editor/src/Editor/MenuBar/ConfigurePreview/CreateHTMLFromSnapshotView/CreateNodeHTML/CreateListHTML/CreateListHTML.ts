import { setAttributes } from "../_Utilities";
import type {
	CreateListHTMLParams,
	CreateListHTMLResult,
} from "./CreateListHTML-types";

export const createListHTML = ({
	listView,
	childNodes,
	storageMap,
}: CreateListHTMLParams): CreateListHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } = listView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
