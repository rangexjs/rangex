import { todoCheckboxPart } from "#ports";
import { ensureTodoCheckboxStorage } from "../../../../Storage";
import type { ResolveTodoListParams } from "./TodoList-types";

export const resolveTodoList = async ({
	todoListEl,
	storageMap,
}: ResolveTodoListParams) => {
	const todoCheckboxes = todoListEl.querySelectorAll(todoCheckboxPart.attr);

	for (const todoCheckbox of todoCheckboxes) {
		if (!(todoCheckbox instanceof HTMLInputElement)) {
			throw new Error("TodoCheckbox's type is invalid.");
		}

		const storage = storageMap.get(todoCheckbox);

		const { checked } = ensureTodoCheckboxStorage({
			storage,
			fallbacks: { checked: false },
		});

		todoCheckbox.checked = checked;
		todoCheckbox.style.pointerEvents = "none";
	}
};
