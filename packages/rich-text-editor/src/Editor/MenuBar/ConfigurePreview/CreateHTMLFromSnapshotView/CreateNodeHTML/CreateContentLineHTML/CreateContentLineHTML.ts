import { setAttributes } from "../_Utilities";
import type {
	CreateContentLineHTMLParams,
	CreateContentLineHTMLResult,
} from "./CreateContentLineHTML-types";

export const createContentLineHTML = ({
	contentLineView,
	childNodes,
	storageMap,
}: CreateContentLineHTMLParams): CreateContentLineHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } =
		contentLineView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
