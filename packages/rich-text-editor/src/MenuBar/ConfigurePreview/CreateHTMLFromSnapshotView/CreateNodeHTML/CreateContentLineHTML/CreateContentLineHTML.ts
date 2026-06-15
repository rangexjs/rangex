import { setAttributes } from "../_Utilities";
import type {
	CreateContentLineHTMLParams,
	CreateContentLineHTMLResult,
} from "./CreateContentLineHTML-types";

export const createContentLineHTML = ({
	contentLineView,
	childNodes,
}: CreateContentLineHTMLParams): CreateContentLineHTMLResult => {
	const { namespaceURI, localName, attributes } = contentLineView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
