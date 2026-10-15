import type { BlockComponent } from "@rangex/core";
import type { TodoListId } from "../_Constants";
import type { storageVersion } from "../_Utilities";

export type TodoListStorage = {
	id: TodoListId;
	version: typeof storageVersion;
};

export type CreateTodoListStorageResult = TodoListStorage;

export interface EnsureTodoListStorageParams {
	storage: unknown;
}

export type EnsureTodoListStorageResult = TodoListStorage;

export interface EnsureNodeTodoListStorageParams {
	blockComponent: BlockComponent;
}

export type EnsureNodeTodoListStorageResult = TodoListStorage;
