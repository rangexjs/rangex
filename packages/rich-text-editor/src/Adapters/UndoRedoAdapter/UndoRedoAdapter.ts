import type {
	UndoRedoAdapterConstructorParams,
	UndoRedoEditorPort,
	UndoRedoNavigateParams,
	UndoRedoOnNavigateFn,
	UndoRedoToolbarButtonState,
	UndoRedoUIPort,
	UndoRedoUpdateHistoryBackToolbarButtonFn,
	UndoRedoUpdateHistoryForwardToolbarButtonFn,
	UpdateUndoRedoStateParams,
} from "./UndoRedoAdapter-types";

export class UndoRedoAdapter {
	#historyBackToolbarButton: UndoRedoToolbarButtonState = { disabled: true };

	constructor(...params: UndoRedoAdapterConstructorParams) {
		const [_settings, _options] = params;
	}

	#historyForwardToolbarButton: UndoRedoToolbarButtonState = {
		disabled: true,
	};

	#historyBackToolbarButtonListeners: Set<UndoRedoUpdateHistoryBackToolbarButtonFn> =
		new Set();
	#historyForwardToolbarButtonListeners: Set<UndoRedoUpdateHistoryForwardToolbarButtonFn> =
		new Set();
	#onNavigateListeners: Set<UndoRedoOnNavigateFn> = new Set();

	#uiPort: UndoRedoUIPort | null = null;
	#editorPort: UndoRedoEditorPort | null = null;

	#updateState({
		historyBackToolbarButton,
		historyForwardToolbarButton,
	}: UpdateUndoRedoStateParams) {
		if (historyBackToolbarButton !== undefined) {
			this.#historyBackToolbarButton = historyBackToolbarButton;

			for (const listener of this.#historyBackToolbarButtonListeners) {
				listener(this.#historyBackToolbarButton);
			}
		}

		if (historyForwardToolbarButton !== undefined) {
			this.#historyForwardToolbarButton = historyForwardToolbarButton;

			for (const listener of this.#historyForwardToolbarButtonListeners) {
				listener(this.#historyForwardToolbarButton);
			}
		}
	}

	get uiPort(): UndoRedoUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get historyBackToolbarButton() {
				return adapter.#historyBackToolbarButton;
			},

			get historyForwardToolbarButton() {
				return adapter.#historyForwardToolbarButton;
			},

			onHistoryBackToolbarButtonUpdate: (callback) => {
				adapter.#historyBackToolbarButtonListeners.add(callback);
				return () =>
					adapter.#historyBackToolbarButtonListeners.delete(callback);
			},

			onHistoryForwardToolbarButtonUpdate: (callback) => {
				adapter.#historyForwardToolbarButtonListeners.add(callback);
				return () =>
					adapter.#historyForwardToolbarButtonListeners.delete(callback);
			},

			emitNavigate: (params: UndoRedoNavigateParams) => {
				for (const listener of adapter.#onNavigateListeners) {
					listener(params);
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): UndoRedoEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			updateState: (params) => adapter.#updateState(params),

			onNavigate: (callback) => {
				adapter.#onNavigateListeners.add(callback);
				return () => adapter.#onNavigateListeners.delete(callback);
			},
		};

		return this.#editorPort;
	}
}
