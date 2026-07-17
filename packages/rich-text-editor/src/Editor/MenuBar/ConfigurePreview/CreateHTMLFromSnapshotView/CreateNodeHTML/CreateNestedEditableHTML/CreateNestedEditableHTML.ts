import { setAttributes } from "../_Utilities";
import type {
	CreateNestedEditableHTMLParams,
	CreateNestedEditableHTMLResult,
} from "./CreateNestedEditableHTML-types";

export const createNestedEditableHTML = ({
	nestedEditableView,
	childNodes,
}: CreateNestedEditableHTMLParams): CreateNestedEditableHTMLResult => {
	const { namespaceURI, localName, attributes } = nestedEditableView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
