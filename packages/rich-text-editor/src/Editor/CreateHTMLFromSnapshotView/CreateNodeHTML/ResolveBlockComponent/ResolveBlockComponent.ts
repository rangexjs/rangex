import { componentsName } from "#ports";
import { resolveAccordionItem } from "./AccordionItem";
import { resolveCodeBlock } from "./CodeBlock";
import type { ResolveBlockComponentParams } from "./ResolveBlockComponent-types";
import { resolveTodoList } from "./TodoList";

export const resolveBlockComponent = ({
	blockComponentEl,
	componentName,
	pendingTasks,
	storageMap,
}: ResolveBlockComponentParams): void => {
	if (componentName === componentsName.accordionItem) {
		pendingTasks.push(
			resolveAccordionItem({ accordionItemEl: blockComponentEl }),
		);
	}

	if (componentName === componentsName.codeBlock) {
		pendingTasks.push(
			resolveCodeBlock({ codeBlockEl: blockComponentEl, storageMap }),
		);
	}

	if (componentName === componentsName.todoList) {
		pendingTasks.push(
			resolveTodoList({ todoListEl: blockComponentEl, storageMap }),
		);
	}
};
