import type {
	TodoListAdapterConstructorParams,
	TodoListEditorPort,
	TodoListOnInsertRequestFn,
	TodoListToolbarButtonState,
	TodoListUIPort,
	TodoListUpdateToolbarButtonFn,
	UpdateTodoListStateParams,
} from "./TodoListAdapter-types";

export class TodoListAdapter {
	#toolbarButton: TodoListToolbarButtonState = { disabled: true };

	constructor(...params: TodoListAdapterConstructorParams) {
		const [_settings, _options] = params;
	}

	#toolbarButtonListeners: Set<TodoListUpdateToolbarButtonFn> = new Set();
	#onInsertRequestListeners: Set<TodoListOnInsertRequestFn> = new Set();

	#uiPort: TodoListUIPort | null = null;
	#editorPort: TodoListEditorPort | null = null;

	#updateState({ toolbarButton }: UpdateTodoListStateParams) {
		if (toolbarButton !== undefined) {
			this.#toolbarButton = toolbarButton;

			for (const listener of this.#toolbarButtonListeners) {
				listener(this.#toolbarButton);
			}
		}
	}

	get uiPort(): TodoListUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get toolbarButton() {
				return adapter.#toolbarButton;
			},

			onToolbarButtonUpdate: (callback) => {
				adapter.#toolbarButtonListeners.add(callback);
				return () => adapter.#toolbarButtonListeners.delete(callback);
			},

			emitInsertRequest: () => {
				for (const listener of adapter.#onInsertRequestListeners) {
					listener();
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): TodoListEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			updateState: (params) => adapter.#updateState(params),

			onInsertRequest: (callback) => {
				adapter.#onInsertRequestListeners.add(callback);
				return () => adapter.#onInsertRequestListeners.delete(callback);
			},
		};

		return this.#editorPort;
	}
}
