import { todoCheckboxPart } from "#ports";
import { ensureTodoCheckboxStorage } from "../../../../../../Storage";
import type { ResolveTodoListParams } from "./TodoList-types";

export const resolveTodoList = async ({
	todoListEl,
	customStorage,
}: ResolveTodoListParams) => {
	const todoCheckboxes = todoListEl.querySelectorAll(todoCheckboxPart.attr);

	for (const todoCheckbox of todoCheckboxes) {
		if (!(todoCheckbox instanceof HTMLInputElement)) {
			throw new Error("TodoCheckbox's type is invalid.");
		}

		const { checked } = ensureTodoCheckboxStorage({
			storage: customStorage,
			fallbacks: { checked: false },
		});

		todoCheckbox.checked = checked;
	}
};
