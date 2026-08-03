import { adapterIds } from "#ports";
import type {
	BlockQuoteAdapterConstructorParams,
	BlockQuoteEditorPort,
	BlockQuoteOnInsertRequestFn,
	BlockQuoteToolbarButtonState,
	BlockQuoteUIPort,
	BlockQuoteUpdateToolbarButtonFn,
	UpdateBlockQuoteStateParams,
} from "./BlockQuoteAdapter-types";

export class BlockQuoteAdapter {
	#toolbarButton: BlockQuoteToolbarButtonState = { disabled: true };

	constructor(...params: BlockQuoteAdapterConstructorParams) {
		const [_settings, _options] = params;
	}

	get id() {
		return adapterIds.blockQuote;
	}

	#toolbarButtonListeners: Set<BlockQuoteUpdateToolbarButtonFn> = new Set();
	#onInsertRequestListeners: Set<BlockQuoteOnInsertRequestFn> = new Set();

	#uiPort: BlockQuoteUIPort | null = null;
	#editorPort: BlockQuoteEditorPort | null = null;

	#updateState({ toolbarButton }: UpdateBlockQuoteStateParams) {
		if (toolbarButton !== undefined) {
			this.#toolbarButton = toolbarButton;

			for (const listener of this.#toolbarButtonListeners) {
				listener(this.#toolbarButton);
			}
		}
	}

	get uiPort(): BlockQuoteUIPort {
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

	get editorPort(): BlockQuoteEditorPort {
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
