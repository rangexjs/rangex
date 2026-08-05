import { setAttributes } from "../_Utilities";
import type {
	CreateTableColGroupHTMLParams,
	CreateTableColGroupHTMLResult,
} from "./CreateTableColGroupHTML-types";

export const createTableColGroupHTML = ({
	tableColGroupView,
	childNodes,
	storageMap,
}: CreateTableColGroupHTMLParams): CreateTableColGroupHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } =
		tableColGroupView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
