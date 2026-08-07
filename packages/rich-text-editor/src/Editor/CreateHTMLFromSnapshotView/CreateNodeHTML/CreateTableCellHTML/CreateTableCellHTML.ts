import { setAttributes } from "../_Utilities";
import type {
	CreateTableCellHTMLParams,
	CreateTableCellHTMLResult,
} from "./CreateTableCellHTML-types";

export const createTableCellHTML = ({
	tableCellView,
	childNodes,
	storageMap,
}: CreateTableCellHTMLParams): CreateTableCellHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } = tableCellView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
