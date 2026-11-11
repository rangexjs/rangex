import {
	blockComponentRole,
	blockComponentRoleSelector,
	htmlLayoutRole,
	isEditorNode,
	listChildNodesChangeEventType,
} from "@rangex/core";

import { componentsName, todoCheckboxPart } from "#constants";

import type { HandleTodoListCheckboxStateParams } from "./HandleTodoListCheckboxState-types";

/*
 * Keeps each todo item's checkbox in sync with its `checked` attribute, the stored checked state:
 * restoring it whenever list items are added (unchecking copies, e.g. after pressing Enter), and
 * writing it back whenever the checkbox itself is toggled. Returns a cleanup function.
 */
export const handleTodoListCheckboxState = ({ editorAPI }: HandleTodoListCheckboxStateParams) => {
	const unsubscribeListChange = editorAPI.subscribeEditorEvent({
		type: listChildNodesChangeEventType,
		callback: ({ lists }) => {
			for (const [list, addedListItems] of lists) {
				const blockComponent = list.$$closest(blockComponentRoleSelector);

				if (blockComponent?.$$editorRole !== blockComponentRole) {
					continue;
				}

				if (blockComponent.$$name !== componentsName.todoList) {
					continue;
				}

				for (const [listItem, wasCopied] of addedListItems) {
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

					if (wasCopied) {
						todoCheckbox.defaultChecked = false;
						todoCheckbox.checked = false;

						for (const animation of todoCheckbox.getAnimations()) {
							animation.finish();
						}

						continue;
					}

					todoCheckbox.checked = todoCheckbox.defaultChecked;
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

				currentTarget.defaultChecked = currentTarget.checked;
			},
		},
	});

	return () => {
		unsubscribeListChange();
		unsubscribeChange();
	};
};
