import { validateCheckboxStorage } from "../../../../../../Components/ConfigureTodoList";
import type { ApplyTodoCheckboxOutputParams } from "./TodoCheckbox-types";

export const applyTodoCheckboxOutput = ({
	el,
	view,
}: ApplyTodoCheckboxOutputParams): void => {
	const storage = view.customStorage;

	if (!validateCheckboxStorage(storage)) {
		throw new Error("Expected CheckboxStorage on todo checkbox element.");
	}

	if (!(el instanceof HTMLInputElement)) {
		throw new Error("Expected HTMLInputElement for todo list checkbox.");
	}

	el.checked = storage.checked;
	el.style.pointerEvents = "none";
};
