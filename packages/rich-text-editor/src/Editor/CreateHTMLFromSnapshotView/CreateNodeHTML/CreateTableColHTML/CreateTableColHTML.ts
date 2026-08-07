import { setAttributes } from "../_Utilities";
import type {
	CreateTableColHTMLParams,
	CreateTableColHTMLResult,
} from "./CreateTableColHTML-types";

export const createTableColHTML = ({
	tableColView,
	childNodes,
	storageMap,
}: CreateTableColHTMLParams): CreateTableColHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } = tableColView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
