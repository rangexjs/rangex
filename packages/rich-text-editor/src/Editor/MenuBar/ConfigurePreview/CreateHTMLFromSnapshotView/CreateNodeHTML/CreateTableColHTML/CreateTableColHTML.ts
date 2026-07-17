import { setAttributes } from "../_Utilities";
import type {
	CreateTableColHTMLParams,
	CreateTableColHTMLResult,
} from "./CreateTableColHTML-types";

export const createTableColHTML = ({
	tableColView,
	childNodes,
}: CreateTableColHTMLParams): CreateTableColHTMLResult => {
	const { namespaceURI, localName, attributes } = tableColView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
