import { setAttributes } from "../_Utilities";
import type {
	CreateTableHTMLParams,
	CreateTableHTMLResult,
} from "./CreateTableHTML-types";

export const createTableHTML = ({
	tableView,
	childNodes,
}: CreateTableHTMLParams): CreateTableHTMLResult => {
	const { namespaceURI, localName, attributes } = tableView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
