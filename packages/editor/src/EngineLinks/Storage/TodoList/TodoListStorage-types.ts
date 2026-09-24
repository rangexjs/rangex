import type { BlockComponent, HTMLLayout } from "rich-text-area";
import type { TodoCheckboxId, TodoListId } from "../../Constants";
import type { storageVersion } from "../_Utilities";

// TodoList
export interface TodoListStorage {
	id: TodoListId;
	version: typeof storageVersion;
}

export interface CreateTodoListStorageResult extends TodoListStorage {}

export interface EnsureTodoListStorageParams {
	storage: unknown;
}

export interface EnsureTodoListStorageResult extends TodoListStorage {}

export interface EnsureNodeTodoListStorageParams {
	blockComponent: BlockComponent;
}

export interface EnsureNodeTodoListStorageResult extends TodoListStorage {}

// TodoCheckbox
export interface TodoCheckboxStorage {
	id: TodoCheckboxId;
	version: typeof storageVersion;
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
