import {
	isElementNameMatch,
	todoCheckboxElementName,
} from "../../../../../Constants";
import { setAttributes } from "../_Utilities";
import type {
	CreateHTMLLayoutHTMLParams,
	CreateHTMLLayoutHTMLResult,
} from "./CreateHTMLLayoutHTML-types";
import { applyTodoCheckboxOutput } from "./TodoCheckbox";

export const createHTMLLayoutHTML = ({
	htmlLayoutView,
	childNodes,
}: CreateHTMLLayoutHTMLParams): CreateHTMLLayoutHTMLResult => {
	const { namespaceURI, localName, attributes } = htmlLayoutView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	if (isElementNameMatch(todoCheckboxElementName, el)) {
		applyTodoCheckboxOutput({ el, view: htmlLayoutView });
	}

	return el;
};
