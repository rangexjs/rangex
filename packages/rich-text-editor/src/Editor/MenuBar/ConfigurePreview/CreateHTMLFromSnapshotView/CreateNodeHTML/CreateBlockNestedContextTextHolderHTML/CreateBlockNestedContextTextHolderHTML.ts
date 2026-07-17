import { setAttributes } from "../_Utilities";
import type {
	CreateBlockNestedContextTextHolderHTMLParams,
	CreateBlockNestedContextTextHolderHTMLResult,
} from "./CreateBlockNestedContextTextHolderHTML-types";

export const createBlockNestedContextTextHolderHTML = ({
	blockNestedContextTextHolderView,
	childNodes,
}: CreateBlockNestedContextTextHolderHTMLParams): CreateBlockNestedContextTextHolderHTMLResult => {
	const { namespaceURI, localName, attributes } =
		blockNestedContextTextHolderView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
