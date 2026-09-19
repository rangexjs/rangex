import type {
	CreateAdapterParams,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

export interface TodoListState {
	canInsert?: boolean;
	canWrap?: boolean;
	isActive?: boolean;
}

export type OnCanInsertUpdateCallbackFn = (canInsert: boolean) => void;
export type OnCanWrapUpdateCallbackFn = (canWrap: boolean) => void;
export type OnIsActiveUpdateCallbackFn = (isActive: boolean) => void;

export type OnInsertCallbackFn = () => void;
export type OnWrapCallbackFn = () => void;

export interface UpdateStateParams extends TodoListState {}

export interface TodoListConfigPortProps {
	updateState(params: UpdateStateParams): void;

	onInsert(callback: OnInsertCallbackFn): () => void;
	onWrap(callback: OnWrapCallbackFn): () => void;
}

export interface TodoListConfigPort
	extends TodoListConfigPortProps,
		UnwrapConfigPort {}

export interface TodoListPublicPortProps {
	readonly canInsert: boolean;
	readonly canWrap: boolean;
	readonly isActive: boolean;

	onCanInsertUpdate(callback: OnCanInsertUpdateCallbackFn): () => void;
	onCanWrapUpdate(callback: OnCanWrapUpdateCallbackFn): () => void;
	onIsActiveUpdate(callback: OnIsActiveUpdateCallbackFn): () => void;

	insert(): void;
	wrap(): void;
}

export interface TodoListPublicPort
	extends TodoListPublicPortProps,
		UnwrapPublicPort {}

export interface TodoListInternals {
	canInsert: boolean;
	canWrap: boolean;
	isActive: boolean;
}

export interface TodoListAdapter {
	configPort: TodoListConfigPort;
	publicPort: TodoListPublicPort;
}

export interface TodoListSettings {}

export interface CreateTodoListAdapterParams
	extends CreateAdapterParams<TodoListSettings> {}

export interface CreateTodoListAdapterResult extends TodoListAdapter {}
