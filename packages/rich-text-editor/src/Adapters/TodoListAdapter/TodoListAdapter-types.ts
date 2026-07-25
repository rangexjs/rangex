export interface TodoListToolbarButtonState {
	disabled: boolean;
}

export interface TodoListState {
	toolbarButton?: TodoListToolbarButtonState;
}

export interface UpdateTodoListStateParams extends TodoListState {}

export type TodoListUpdateToolbarButtonFn = (
	value: TodoListToolbarButtonState,
) => void;

export interface TodoListUIPort {
	readonly toolbarButton: TodoListToolbarButtonState;
	onToolbarButtonUpdate(callback: TodoListUpdateToolbarButtonFn): () => void;
	emitInsertRequest(): void;
}

export type TodoListOnInsertRequestFn = () => void;

export interface TodoListEditorPort {
	updateState(params: UpdateTodoListStateParams): void;
	onInsertRequest(callback: TodoListOnInsertRequestFn): () => void;
}
