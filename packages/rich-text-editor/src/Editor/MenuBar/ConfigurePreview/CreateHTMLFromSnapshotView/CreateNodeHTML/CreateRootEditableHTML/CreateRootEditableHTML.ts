import { setAttributes } from "../_Utilities";
import type {
	CreateRootEditableHTMLParams,
	CreateRootEditableHTMLResult,
} from "./CreateRootEditableHTML-types";

export const createRootEditableHTML = ({
	rootEditableView,
	childNodes,
	storageMap,
}: CreateRootEditableHTMLParams): CreateRootEditableHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } =
		rootEditableView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
