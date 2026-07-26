import type {
	ReadOnlyAdapterConstructorParams,
	ReadOnlyEditorPort,
	ReadOnlyEmitToggleParams,
	ReadOnlyOnToggleFn,
	ReadOnlyToolbarButtonState,
	ReadOnlyUIPort,
	ReadOnlyUpdateToolbarButtonFn,
	UpdateReadOnlyStateParams,
} from "./ReadOnlyAdapter-types";

export class ReadOnlyAdapter {
	#toolbarButton: ReadOnlyToolbarButtonState = { checked: false };

	constructor(...params: ReadOnlyAdapterConstructorParams) {
		const [_settings, _options] = params;
	}

	#toolbarButtonListeners: Set<ReadOnlyUpdateToolbarButtonFn> = new Set();
	#onToggleListeners: Set<ReadOnlyOnToggleFn> = new Set();

	#uiPort: ReadOnlyUIPort | null = null;
	#editorPort: ReadOnlyEditorPort | null = null;

	#updateState({ toolbarButton }: UpdateReadOnlyStateParams) {
		if (toolbarButton !== undefined) {
			this.#toolbarButton = toolbarButton;

			for (const listener of this.#toolbarButtonListeners) {
				listener(this.#toolbarButton);
			}
		}
	}

	get uiPort(): ReadOnlyUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get toolbarButton() {
				return adapter.#toolbarButton;
			},

			onToolbarButtonUpdate: (callback) => {
				adapter.#toolbarButtonListeners.add(callback);
				return () => adapter.#toolbarButtonListeners.delete(callback);
			},

			emitToggle: (params: ReadOnlyEmitToggleParams) => {
				for (const listener of adapter.#onToggleListeners) {
					listener(params);
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): ReadOnlyEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			updateState: (params) => adapter.#updateState(params),

			onToggle: (callback) => {
				adapter.#onToggleListeners.add(callback);
				return () => adapter.#onToggleListeners.delete(callback);
			},
		};

		return this.#editorPort;
	}
}
