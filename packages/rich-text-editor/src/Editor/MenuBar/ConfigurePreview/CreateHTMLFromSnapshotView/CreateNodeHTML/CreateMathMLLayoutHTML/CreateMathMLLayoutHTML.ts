import { setAttributes } from "../_Utilities";
import type {
	CreateMathMLLayoutHTMLParams,
	CreateMathMLLayoutHTMLResult,
} from "./CreateMathMLLayoutHTML-types";

export const createMathMLLayoutHTML = ({
	mathMLLayoutView,
	childNodes,
}: CreateMathMLLayoutHTMLParams): CreateMathMLLayoutHTMLResult => {
	const { namespaceURI, localName, attributes } = mathMLLayoutView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
