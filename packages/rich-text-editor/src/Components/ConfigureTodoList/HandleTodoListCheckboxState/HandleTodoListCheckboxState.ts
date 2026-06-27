import {
	blockNestedContextName,
	blockNestedContextRoleSelector,
	isEditorNode,
	listChildNodesChangeEventType,
} from "rich-text-area";
import {
	componentsName,
	createElementNameSelector,
	todoCheckboxElementName,
	todoListCheckboxId,
} from "../../../Constants";
import {
	type CheckboxStorage,
	validateCheckboxStorage,
} from "../CheckboxStorage";
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

					if (!validateCheckboxStorage(todoCheckbox.$$customStorage)) {
						todoCheckbox.$$customStorage = {
							id: todoListCheckboxId,
							checked: false,
						} satisfies CheckboxStorage;
					}
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

				currentTarget.$$customStorage = {
					...currentTarget.$$customStorage,
					checked: currentTarget.checked,
				} satisfies CheckboxStorage;
			},
		},
	});

	return () => {
		unsubscribeListChange();
		unsubscribeChange();
	};
};
