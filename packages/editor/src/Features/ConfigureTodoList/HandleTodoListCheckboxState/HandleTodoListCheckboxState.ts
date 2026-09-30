import {
	blockComponentRole,
	blockComponentRoleSelector,
	htmlLayoutRole,
	isEditorNode,
	listChildNodesChangeEventType,
} from "rich-text-area";
import { componentsName, todoCheckboxPart } from "#engine-links";
import {
	ensureNodeTodoCheckboxStorage,
	todoCheckboxStorageFallbacks,
} from "#storage";
import type { HandleTodoListCheckboxStateParams } from "./HandleTodoListCheckboxState-types";

/*
 * Keeps each todo item's checkbox in sync with its stored checked state: restoring it whenever
 * list items change, and persisting it back to storage whenever the checkbox itself is toggled.
 * Returns a cleanup function.
 */
export const handleTodoListCheckboxState = ({
	editorAPI,
}: HandleTodoListCheckboxStateParams) => {
	const unsubscribeListChange = editorAPI.subscribeEditorEvent({
		type: listChildNodesChangeEventType,
		callback: ({ lists }) => {
			for (const list of lists) {
				const blockComponent = list.$$closest(blockComponentRoleSelector);

				if (blockComponent?.$$editorRole !== blockComponentRole) {
					continue;
				}

				if (blockComponent.$$name !== componentsName.todoList) {
					continue;
				}

				for (const listItem of list.$$children) {
					const todoCheckbox = listItem.$$querySelector(todoCheckboxPart.attr);

					if (!todoCheckbox) {
						throw new Error("TodoCheckbox wasn't found.");
					}

					if (todoCheckbox.$$editorRole !== htmlLayoutRole) {
						throw new Error("TodoCheckbox's type is invalid.");
					}

					if (!(todoCheckbox instanceof HTMLInputElement)) {
						throw new Error("TodoCheckbox's type is invalid.");
					}

					const storage = ensureNodeTodoCheckboxStorage({
						htmlLayout: todoCheckbox,
						fallbacks: todoCheckboxStorageFallbacks,
					});

					todoCheckbox.checked = storage.checked;
				}
			}
		},
	});

	const unsubscribeChange = editorAPI.registerDOMEvent({
		when: ({ element }) => element.matches(todoCheckboxPart.attr),
		eventListener: {
			type: "change",
			listener: (event) => {
				const { currentTarget } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (currentTarget.$$editorRole !== htmlLayoutRole) {
					throw new Error("CurrentTarget's type is invalid.");
				}

				if (!(currentTarget instanceof HTMLInputElement)) {
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
