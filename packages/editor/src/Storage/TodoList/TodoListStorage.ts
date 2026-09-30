import { todoCheckboxId, todoListId } from "../_Constants";
import { isStorage, storageVersion, validateStorage } from "../_Utilities";
import type {
	CreateTodoCheckboxStorageParams,
	CreateTodoCheckboxStorageResult,
	CreateTodoListStorageResult,
	EnsureNodeTodoCheckboxStorageParams,
	EnsureNodeTodoCheckboxStorageResult,
	EnsureNodeTodoListStorageParams,
	EnsureNodeTodoListStorageResult,
	EnsureTodoCheckboxStorageParams,
	EnsureTodoCheckboxStorageResult,
	EnsureTodoListStorageParams,
	EnsureTodoListStorageResult,
	TodoCheckboxStorage,
	TodoCheckboxStorageFallbacks,
	TodoListStorage,
} from "./TodoListStorage-types";

// TodoList
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

// TodoCheckbox
export const isTodoCheckboxStorage = (
	storage: unknown,
): storage is TodoCheckboxStorage => {
	return isStorage(storage, { id: todoCheckboxId });
};

export const validateTodoCheckboxStorage = (
	storage: unknown,
): storage is TodoCheckboxStorage => {
	return validateStorage(storage, isTodoCheckboxStorage);
};

export const todoCheckboxStorageFallbacks: TodoCheckboxStorageFallbacks = {
	checked: false,
};

export const createTodoCheckboxStorage = ({
	checked,
}: CreateTodoCheckboxStorageParams): CreateTodoCheckboxStorageResult => ({
	id: todoCheckboxId,
	version: storageVersion,
	checked,
});

export const ensureTodoCheckboxStorage = ({
	storage,
	fallbacks,
}: EnsureTodoCheckboxStorageParams): EnsureTodoCheckboxStorageResult => {
	if (validateTodoCheckboxStorage(storage)) {
		return storage;
	}

	return createTodoCheckboxStorage(fallbacks);
};

export const ensureNodeTodoCheckboxStorage = ({
	htmlLayout,
	fallbacks,
}: EnsureNodeTodoCheckboxStorageParams): EnsureNodeTodoCheckboxStorageResult => {
	const { $$customStorage } = htmlLayout;

	const storage = ensureTodoCheckboxStorage({
		storage: $$customStorage,
		fallbacks,
	});
	htmlLayout.$$customStorage = storage;

	return storage;
};
