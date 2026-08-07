import { setAttributes } from "../_Utilities";
import type {
	CreateNestedEditableHTMLParams,
	CreateNestedEditableHTMLResult,
} from "./CreateNestedEditableHTML-types";

export const createNestedEditableHTML = ({
	nestedEditableView,
	childNodes,
	storageMap,
}: CreateNestedEditableHTMLParams): CreateNestedEditableHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } =
		nestedEditableView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
