import { todoCheckboxId } from "../../Constants";
import type {
	CreateTodoCheckboxStorageParams,
	CreateTodoCheckboxStorageResult,
	EnsureNodeTodoCheckboxStorageParams,
	EnsureNodeTodoCheckboxStorageResult,
	EnsureTodoCheckboxStorageParams,
	EnsureTodoCheckboxStorageResult,
	TodoCheckboxStorage,
	TodoCheckboxStorageFallbacks,
} from "./TodoCheckboxStorage-types";

export const todoCheckboxStorageVersion = 1 as const;

export const isTodoCheckboxStorage = (
	storage: unknown,
): storage is TodoCheckboxStorage =>
	typeof storage === "object" &&
	storage !== null &&
	"id" in storage &&
	storage.id === todoCheckboxId &&
	"version" in storage &&
	storage.version === todoCheckboxStorageVersion;

export const validateTodoCheckboxStorage = (
	storage: unknown,
): storage is TodoCheckboxStorage => {
	const isValid = isTodoCheckboxStorage(storage);

	if (!isValid) {
		console.warn("validateTodoCheckboxStorage: unexpected data shape", storage);
	}

	return isValid;
};

export const todoCheckboxStorageFallbacks: TodoCheckboxStorageFallbacks = {
	checked: false,
};

export const createTodoCheckboxStorage = ({
	checked,
}: CreateTodoCheckboxStorageParams): CreateTodoCheckboxStorageResult => ({
	id: todoCheckboxId,
	version: todoCheckboxStorageVersion,
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
