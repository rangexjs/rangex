import { adapterIds } from "#ports";
import type {
	SeparatorAdapterConstructorParams,
	SeparatorEditorPort,
	SeparatorOnInsertRequestFn,
	SeparatorToolbarButtonState,
	SeparatorUIPort,
	SeparatorUpdateToolbarButtonFn,
	UpdateSeparatorStateParams,
} from "./SeparatorAdapter-types";

export class SeparatorAdapter {
	#toolbarButton: SeparatorToolbarButtonState = { disabled: true };

	#toolbarButtonListeners: Set<SeparatorUpdateToolbarButtonFn> = new Set();
	#onInsertRequestListeners: Set<SeparatorOnInsertRequestFn> = new Set();

	#uiPort: SeparatorUIPort | null = null;
	#editorPort: SeparatorEditorPort | null = null;

	constructor(...params: SeparatorAdapterConstructorParams) {
		const [_settings, _options] = params;
	}

	get id() {
		return adapterIds.separator;
	}

	#updateState({ toolbarButton }: UpdateSeparatorStateParams) {
		if (toolbarButton !== undefined) {
			this.#toolbarButton = toolbarButton;

			for (const listener of this.#toolbarButtonListeners) {
				listener(this.#toolbarButton);
			}
		}
	}

	get uiPort(): SeparatorUIPort {
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

	get editorPort(): SeparatorEditorPort {
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
