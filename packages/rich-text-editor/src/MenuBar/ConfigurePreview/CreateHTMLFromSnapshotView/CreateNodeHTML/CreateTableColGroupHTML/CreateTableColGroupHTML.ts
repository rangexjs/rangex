import { setAttributes } from "../_Utilities";
import type {
	CreateTableColGroupHTMLParams,
	CreateTableColGroupHTMLResult,
} from "./CreateTableColGroupHTML-types";

export const createTableColGroupHTML = ({
	tableColGroupView,
	childNodes,
}: CreateTableColGroupHTMLParams): CreateTableColGroupHTMLResult => {
	const { namespaceURI, localName, attributes } = tableColGroupView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
