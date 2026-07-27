import type { HTMLLayout } from "rich-text-area";
import type { TodoCheckboxId } from "../../Constants";
import type { todoCheckboxStorageVersion } from "./TodoCheckboxStorage";

export interface TodoCheckboxStorage {
	id: TodoCheckboxId;
	version: typeof todoCheckboxStorageVersion;
	checked: boolean;
}

export interface CreateTodoCheckboxStorageParams {
	checked: boolean;
}

export interface CreateTodoCheckboxStorageResult extends TodoCheckboxStorage {}

export interface TodoCheckboxStorageFallbacks {
	checked: boolean;
}

export interface EnsureTodoCheckboxStorageParams {
	storage: unknown;
	fallbacks: TodoCheckboxStorageFallbacks;
}

export interface EnsureTodoCheckboxStorageResult extends TodoCheckboxStorage {}

export interface EnsureNodeTodoCheckboxStorageParams {
	htmlLayout: HTMLLayout;
	fallbacks: TodoCheckboxStorageFallbacks;
}

export interface EnsureNodeTodoCheckboxStorageResult
	extends TodoCheckboxStorage {}
