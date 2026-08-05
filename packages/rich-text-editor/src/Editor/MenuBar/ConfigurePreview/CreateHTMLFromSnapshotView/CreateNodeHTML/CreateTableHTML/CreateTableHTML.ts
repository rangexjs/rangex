import { setAttributes } from "../_Utilities";
import type {
	CreateTableHTMLParams,
	CreateTableHTMLResult,
} from "./CreateTableHTML-types";

export const createTableHTML = ({
	tableView,
	childNodes,
	storageMap,
}: CreateTableHTMLParams): CreateTableHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } = tableView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
