import { setAttributes } from "../_Utilities";
import type {
	CreateBlockComponentTextHolderHTMLParams,
	CreateBlockComponentTextHolderHTMLResult,
} from "./CreateBlockComponentTextHolderHTML-types";

export const createBlockComponentTextHolderHTML = ({
	blockComponentTextHolderView,
	childNodes,
	storageMap,
}: CreateBlockComponentTextHolderHTMLParams): CreateBlockComponentTextHolderHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } =
		blockComponentTextHolderView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
