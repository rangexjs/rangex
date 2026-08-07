import { setAttributes } from "../_Utilities";
import type {
	CreateTableSectionHTMLParams,
	CreateTableSectionHTMLResult,
} from "./CreateTableSectionHTML-types";

export const createTableSectionHTML = ({
	tableSectionView,
	childNodes,
	storageMap,
}: CreateTableSectionHTMLParams): CreateTableSectionHTMLResult => {
	const { namespaceURI, localName, attributes, customStorage } =
		tableSectionView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	return el;
};
