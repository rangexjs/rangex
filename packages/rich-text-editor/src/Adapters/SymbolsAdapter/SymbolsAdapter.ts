import { adapterIds } from "#ports";
import { defaultSymbolsItems } from "./SymbolsAdapter-default";
import type {
	SymbolsAdapterConstructorParams,
	SymbolsEditorPort,
	SymbolsItems,
	SymbolsOnInsertRequestFn,
	SymbolsToolbarButtonState,
	SymbolsUIPort,
	SymbolsUpdateToolbarButtonFn,
	UpdateSymbolsStateParams,
} from "./SymbolsAdapter-types";

export class SymbolsAdapter {
	#items: SymbolsItems;
	#toolbarButton: SymbolsToolbarButtonState = { disabled: false };

	#toolbarButtonListeners: Set<SymbolsUpdateToolbarButtonFn> = new Set();
	#onInsertRequestListeners: Set<SymbolsOnInsertRequestFn> = new Set();

	#uiPort: SymbolsUIPort | null = null;
	#editorPort: SymbolsEditorPort | null = null;

	constructor(...params: SymbolsAdapterConstructorParams) {
		const [{ items = defaultSymbolsItems }] = params;

		this.#items = items;
	}

	get id() {
		return adapterIds.symbols;
	}

	#updateState({ toolbarButton }: UpdateSymbolsStateParams) {
		if (toolbarButton !== undefined) {
			this.#toolbarButton = toolbarButton;

			for (const listener of this.#toolbarButtonListeners) {
				listener(this.#toolbarButton);
			}
		}
	}

	get uiPort(): SymbolsUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get items() {
				return adapter.#items;
			},

			get toolbarButton() {
				return adapter.#toolbarButton;
			},

			onToolbarButtonUpdate: (callback) => {
				adapter.#toolbarButtonListeners.add(callback);
				return () => adapter.#toolbarButtonListeners.delete(callback);
			},

			emitInsertRequest: (params) => {
				for (const listener of adapter.#onInsertRequestListeners) {
					listener(params);
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): SymbolsEditorPort {
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
