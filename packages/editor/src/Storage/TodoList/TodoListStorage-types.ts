import type { BlockComponent } from "@rangex/core";
import type { TodoListId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

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
