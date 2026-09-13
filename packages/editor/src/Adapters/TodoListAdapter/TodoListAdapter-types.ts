import type { CreateAdapterParams } from "../_Utilities";

export interface TodoListState {
	canInsert?: boolean;
	canWrap?: boolean;
}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;
export type OnCanWrapUpdateCallbackFn = (canWrap: boolean) => void;

export type OnInsertCallbackFn = () => void;
export type OnWrapCallbackFn = () => void;

export interface UpdateStateParams extends TodoListState {}

export interface TodoListConfigPortProps {
	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onWrap(callback: OnWrapCallbackFn): () => void;
}

export interface TodoListConfigPort extends TodoListConfigPortProps {}

export interface TodoListPublicPortProps {
	readonly canInsert: boolean;
	readonly canWrap: boolean;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onCanWrapUpdate(callback: OnCanWrapUpdateCallbackFn): () => void;

	insert(): void;
	wrap(): void;
}

export interface TodoListPublicPort extends TodoListPublicPortProps {}

export interface TodoListInternals {
	canInsert: boolean;
	canWrap: boolean;
}

export interface TodoListAdapter {
	configPort: TodoListConfigPort;
	publicPort: TodoListPublicPort;
}

export interface TodoListSettings {}

export interface CreateTodoListAdapterParams
	extends CreateAdapterParams<TodoListSettings> {}

export interface CreateTodoListAdapterResult extends TodoListAdapter {}
