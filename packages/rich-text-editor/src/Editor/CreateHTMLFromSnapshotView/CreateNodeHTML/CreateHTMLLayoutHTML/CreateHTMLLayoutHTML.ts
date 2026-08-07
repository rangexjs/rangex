import { setAttributes } from "../_Utilities";
import type {
	CreateHTMLLayoutHTMLParams,
	CreateHTMLLayoutHTMLResult,
} from "./CreateHTMLLayoutHTML-types";

export const createHTMLLayoutHTML = ({
	htmlLayoutView,
	childNodes,
	storageMap,
}: CreateHTMLLayoutHTMLParams): CreateHTMLLayoutHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } = htmlLayoutView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
