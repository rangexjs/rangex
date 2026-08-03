import { setAttributes } from "../_Utilities";
import type {
	CreateBlockComponentTextHolderHTMLParams,
	CreateBlockComponentTextHolderHTMLResult,
} from "./CreateBlockComponentTextHolderHTML-types";

export const createBlockComponentTextHolderHTML = ({
	blockComponentTextHolderView,
	childNodes,
}: CreateBlockComponentTextHolderHTMLParams): CreateBlockComponentTextHolderHTMLResult => {
	const { namespaceURI, localName, attributes } = blockComponentTextHolderView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
