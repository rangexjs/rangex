import { setAttributes } from "../_Utilities";
import type {
	CreateSVGLayoutHTMLParams,
	CreateSVGLayoutHTMLResult,
} from "./CreateSVGLayoutHTML-types";

export const createSVGLayoutHTML = ({
	svgLayoutView,
	childNodes,
}: CreateSVGLayoutHTMLParams): CreateSVGLayoutHTMLResult => {
	const { namespaceURI, localName, attributes } = svgLayoutView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
