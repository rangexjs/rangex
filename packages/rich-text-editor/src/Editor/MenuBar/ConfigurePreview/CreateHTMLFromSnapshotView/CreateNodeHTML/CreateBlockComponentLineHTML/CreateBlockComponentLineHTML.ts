import { setAttributes } from "../_Utilities";
import type {
	CreateBlockComponentLineHTMLParams,
	CreateBlockComponentLineHTMLResult,
} from "./CreateBlockComponentLineHTML-types";

export const createBlockComponentLineHTML = ({
	blockComponentLineView,
	childNodes,
	storageMap,
}: CreateBlockComponentLineHTMLParams): CreateBlockComponentLineHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } =
		blockComponentLineView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
