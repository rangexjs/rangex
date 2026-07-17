import { validateTodoCheckboxStorage } from "../../../../../../Components/ConfigureTodoList";
import type { ApplyTodoCheckboxOutputParams } from "./TodoCheckbox-types";

export const applyTodoCheckboxOutput = ({
	el,
	view,
}: ApplyTodoCheckboxOutputParams): void => {
	const storage = view.customStorage;

	if (!validateTodoCheckboxStorage(storage)) {
		throw new Error("Expected TodoCheckboxStorage on todo checkbox element.");
	}

	if (!(el instanceof HTMLInputElement)) {
		throw new Error("Expected HTMLInputElement for todo list checkbox.");
	}

	el.checked = storage.checked;
	el.style.pointerEvents = "none";
};
