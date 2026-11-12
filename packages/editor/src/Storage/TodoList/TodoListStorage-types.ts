import type { BlockComponent } from "@rangex/core";

import type { TodoListId } from "../_Constants";

export type TodoListStorage = {
	id: TodoListId;
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
