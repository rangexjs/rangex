import { setAttributes } from "../_Utilities";
import type {
	CreateMathMLLayoutHTMLParams,
	CreateMathMLLayoutHTMLResult,
} from "./CreateMathMLLayoutHTML-types";

export const createMathMLLayoutHTML = ({
	mathMLLayoutView,
	childNodes,
	storageMap,
}: CreateMathMLLayoutHTMLParams): CreateMathMLLayoutHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } =
		mathMLLayoutView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
