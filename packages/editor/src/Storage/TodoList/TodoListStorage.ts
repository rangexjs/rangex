import { todoListId } from "../_Constants";
import { isStorage, storageVersion, validateStorage } from "../_Utilities";
import type {
	CreateTodoListStorageResult,
	EnsureNodeTodoListStorageParams,
	EnsureNodeTodoListStorageResult,
	EnsureTodoListStorageParams,
	EnsureTodoListStorageResult,
	TodoListStorage,
} from "./TodoListStorage-types";

export const isTodoListStorage = (
	storage: unknown,
): storage is TodoListStorage => {
	return isStorage(storage, { id: todoListId });
};

export const validateTodoListStorage = (
	storage: unknown,
): storage is TodoListStorage => {
	return validateStorage(storage, isTodoListStorage);
};

export const createTodoListStorage = (): CreateTodoListStorageResult => ({
	id: todoListId,
	version: storageVersion,
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
