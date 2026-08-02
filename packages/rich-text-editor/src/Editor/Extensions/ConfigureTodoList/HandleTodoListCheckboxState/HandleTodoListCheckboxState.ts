import {
	blockNestedContextName,
	blockNestedContextRoleSelector,
	htmlLayoutName,
	isEditorNode,
	listChildNodesChangeEventType,
} from "rich-text-area";
import { componentsName } from "#ports";
import {
	createElementNameSelector,
	todoCheckboxElementName,
} from "../../../Constants";
import {
	ensureNodeTodoCheckboxStorage,
	todoCheckboxStorageFallbacks,
} from "../../../Storage";
import type { HandleTodoListCheckboxStateParams } from "./HandleTodoListCheckboxState-types";

const todoCheckboxSelector = createElementNameSelector(todoCheckboxElementName);

export const handleTodoListCheckboxState = ({
	editorAPI,
}: HandleTodoListCheckboxStateParams) => {
	const unsubscribeListChange = editorAPI.subscribeEditorEvent({
		type: listChildNodesChangeEventType,
		callback: ({ lists }) => {
			for (const list of lists) {
				const blockNestedContext = list.$$closest(
					blockNestedContextRoleSelector,
				);

				if (blockNestedContext?.$$editorRole !== blockNestedContextName) {
					continue;
				}

				if (blockNestedContext.$$componentName !== componentsName.todoList) {
					continue;
				}

				for (const listItem of list.$$children) {
					const todoCheckbox = listItem.$$querySelector(todoCheckboxSelector);

					if (!todoCheckbox) {
						throw new Error("TodoCheckbox wasn't found.");
					}

					if (todoCheckbox.$$editorRole !== htmlLayoutName) {
						throw new Error("TodoCheckbox's type is invalid.");
					}

					ensureNodeTodoCheckboxStorage({
						htmlLayout: todoCheckbox,
						fallbacks: todoCheckboxStorageFallbacks,
					});
				}
			}
		},
	});

	const unsubscribeChange = editorAPI.registerDOMEvent({
		when: ({ element }) => element.matches(todoCheckboxSelector),
		eventListener: {
			type: "change",
			listener: (event) => {
				const { currentTarget } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (!(currentTarget instanceof HTMLInputElement)) {
					throw new Error("CurrentTarget's type is invalid.");
				}

				if (currentTarget.$$editorRole !== htmlLayoutName) {
					throw new Error("CurrentTarget's type is invalid.");
				}

				const storage = ensureNodeTodoCheckboxStorage({
					htmlLayout: currentTarget,
					fallbacks: todoCheckboxStorageFallbacks,
				});
				storage.checked = currentTarget.checked;
			},
		},
	});

	return () => {
		unsubscribeListChange();
		unsubscribeChange();
	};
};
