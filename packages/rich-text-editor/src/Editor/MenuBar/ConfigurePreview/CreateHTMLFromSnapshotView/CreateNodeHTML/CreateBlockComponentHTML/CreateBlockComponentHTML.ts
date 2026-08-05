import { componentsName } from "#ports";
import { setAttributes } from "../_Utilities";
import { resolveCodeBlock } from "./CodeBlock";
import type {
	CreateBlockComponentHTMLParams,
	CreateBlockComponentHTMLResult,
} from "./CreateBlockComponentHTML-types";
import { resolveTodoList } from "./TodoList";

export const createBlockComponentHTML = ({
	blockComponentView,
	childNodes,
	pendingTasks,
}: CreateBlockComponentHTMLParams): CreateBlockComponentHTMLResult => {
	const { namespaceURI, localName, attributes, componentName } =
		blockComponentView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	if (componentName === componentsName.codeBlock) {
		pendingTasks.push(
			resolveCodeBlock({
				codeBlockEl: el,
				customStorage: blockComponentView.customStorage,
			}),
		);
	}

	if (componentName === componentsName.todoList) {
		pendingTasks.push(
			resolveTodoList({
				todoListEl: el,
				customStorage: blockComponentView.customStorage,
			}),
		);
	}

	return el;
};
