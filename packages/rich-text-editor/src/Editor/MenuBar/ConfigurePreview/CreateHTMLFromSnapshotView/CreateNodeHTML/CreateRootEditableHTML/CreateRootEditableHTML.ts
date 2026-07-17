import { setAttributes } from "../_Utilities";
import type {
	CreateRootEditableHTMLParams,
	CreateRootEditableHTMLResult,
} from "./CreateRootEditableHTML-types";

export const createRootEditableHTML = ({
	rootEditableView,
	childNodes,
}: CreateRootEditableHTMLParams): CreateRootEditableHTMLResult => {
	const { namespaceURI, localName, attributes } = rootEditableView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
