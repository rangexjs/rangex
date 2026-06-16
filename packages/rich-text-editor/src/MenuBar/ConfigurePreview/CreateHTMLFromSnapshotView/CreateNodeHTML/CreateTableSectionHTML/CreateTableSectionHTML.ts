import { setAttributes } from "../_Utilities";
import type {
	CreateTableSectionHTMLParams,
	CreateTableSectionHTMLResult,
} from "./CreateTableSectionHTML-types";

export const createTableSectionHTML = ({
	tableSectionView,
	childNodes,
}: CreateTableSectionHTMLParams): CreateTableSectionHTMLResult => {
	const { namespaceURI, localName, attributes } = tableSectionView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	return el;
};
