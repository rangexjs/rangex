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
	storageMap,
}: CreateBlockComponentHTMLParams): CreateBlockComponentHTMLResult => {
	const { namespaceURI, localName, attributes, componentName, customStorage } =
		blockComponentView;
	const el = document.createElementNS(namespaceURI, localName);

	setAttributes({ element: el, attributes });
	el.append(...childNodes);

	storageMap.set(el, customStorage);

	if (componentName === componentsName.codeBlock) {
		pendingTasks.push(resolveCodeBlock({ codeBlockEl: el, storageMap }));
	}

	if (componentName === componentsName.todoList) {
		pendingTasks.push(resolveTodoList({ todoListEl: el, storageMap }));
	}

	return el;
};
