import { componentsName } from "#ports";
import { setAttributes } from "../_Utilities";
import { highlightCodeBlock } from "./CodeBlock";
import type {
	CreateBlockNestedContextHTMLParams,
	CreateBlockNestedContextHTMLResult,
} from "./CreateBlockNestedContextHTML-types";

export const createBlockNestedContextHTML = ({
	blockNestedContextView,
	childNodes,
	pendingTasks,
}: CreateBlockNestedContextHTMLParams): CreateBlockNestedContextHTMLResult => {
	const { namespaceURI, localName, attributes } = blockNestedContextView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	if (blockNestedContextView.componentName === componentsName.codeBlock) {
		pendingTasks.push(
			highlightCodeBlock({
				codeBlockEl: el,
				customStorage: blockNestedContextView.customStorage,
			}),
		);
	}

	return el;
};
