import { setAttributes } from "../_Utilities";
import type {
	CreateInlineComponentHTMLParams,
	CreateInlineComponentHTMLResult,
} from "./CreateInlineComponentHTML-types";

export const createInlineComponentHTML = ({
	inlineComponentView,
	childNodes,
	storageMap,
}: CreateInlineComponentHTMLParams): CreateInlineComponentHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } =
		inlineComponentView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
