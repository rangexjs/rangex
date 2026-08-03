import { componentsName } from "#ports";
import { setAttributes } from "../_Utilities";
import { highlightCodeBlock } from "./CodeBlock";
import type {
	CreateBlockComponentHTMLParams,
	CreateBlockComponentHTMLResult,
} from "./CreateBlockComponentHTML-types";

export const createBlockComponentHTML = ({
	blockComponentView,
	childNodes,
	pendingTasks,
}: CreateBlockComponentHTMLParams): CreateBlockComponentHTMLResult => {
	const { namespaceURI, localName, attributes } = blockComponentView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	if (blockComponentView.componentName === componentsName.codeBlock) {
		pendingTasks.push(
			highlightCodeBlock({
				codeBlockEl: el,
				customStorage: blockComponentView.customStorage,
			}),
		);
	}

	return el;
};
