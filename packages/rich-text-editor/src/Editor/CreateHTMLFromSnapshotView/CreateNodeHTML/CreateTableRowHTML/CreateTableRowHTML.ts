import { setAttributes } from "../_Utilities";
import type {
	CreateTableRowHTMLParams,
	CreateTableRowHTMLResult,
} from "./CreateTableRowHTML-types";

export const createTableRowHTML = ({
	tableRowView,
	childNodes,
	storageMap,
}: CreateTableRowHTMLParams): CreateTableRowHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } = tableRowView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
