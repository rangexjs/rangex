import { type JSONPattern, matchJSON } from "#utilities";
import { todoListId } from "../_Constants";
import { validateStorage } from "../_Utilities";
import type {
	CreateTodoListStorageResult,
	EnsureNodeTodoListStorageParams,
	EnsureNodeTodoListStorageResult,
	EnsureTodoListStorageParams,
	EnsureTodoListStorageResult,
	TodoListStorage,
} from "./TodoListStorage-types";

/*
 * The TodoList's storage, every field checked: any other field, or a value of the wrong type, doesn't match.
 */
export const todoListStoragePattern = {
	id: todoListId,
} satisfies JSONPattern<TodoListStorage>;

/*
 * Matches a value against todoListStoragePattern, returning the first mismatch or null.
 */
export const matchTodoListStorage = (storage: unknown) => {
	return matchJSON({ value: storage, pattern: todoListStoragePattern });
};

export const isTodoListStorage = (
	storage: unknown,
): storage is TodoListStorage => {
	const mismatch = matchTodoListStorage(storage);

	return !mismatch;
};

export const validateTodoListStorage = (
	storage: unknown,
): storage is TodoListStorage => {
	return validateStorage(storage, isTodoListStorage);
};

export const createTodoListStorage = (): CreateTodoListStorageResult => ({
	id: todoListId,
});

export const ensureTodoListStorage = ({
	storage,
}: EnsureTodoListStorageParams): EnsureTodoListStorageResult => {
	if (validateTodoListStorage(storage)) {
		return storage;
	}

	return createTodoListStorage();
};

export const ensureNodeTodoListStorage = ({
	blockComponent,
}: EnsureNodeTodoListStorageParams): EnsureNodeTodoListStorageResult => {
	const { $$customStorage } = blockComponent;

	const storage = ensureTodoListStorage({ storage: $$customStorage });
	blockComponent.$$customStorage = storage;

	return storage;
};
