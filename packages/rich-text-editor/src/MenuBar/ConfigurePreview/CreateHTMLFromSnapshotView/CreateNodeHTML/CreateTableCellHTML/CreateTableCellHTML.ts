import { setAttributes } from "../_Utilities";
import type {
	CreateTableCellHTMLParams,
	CreateTableCellHTMLResult,
} from "./CreateTableCellHTML-types";

export const createTableCellHTML = ({
	tableCellView,
	childNodes,
}: CreateTableCellHTMLParams): CreateTableCellHTMLResult => {
	const { namespaceURI, localName, attributes } = tableCellView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
