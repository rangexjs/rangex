import { setAttributes } from "../_Utilities";
import type {
	CreateTableRowHTMLParams,
	CreateTableRowHTMLResult,
} from "./CreateTableRowHTML-types";

export const createTableRowHTML = ({
	tableRowView,
	childNodes,
}: CreateTableRowHTMLParams): CreateTableRowHTMLResult => {
	const { namespaceURI, localName, attributes } = tableRowView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
