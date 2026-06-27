import type { TodoListCheckboxId } from "../../../Constants";

// Stored on each HTMLLayout checkbox node via $$customStorage.
// Identifies the node as a todo-list checkbox and persists its checked state.
export interface CheckboxStorage {
	id: TodoListCheckboxId;
	checked: boolean;
}
