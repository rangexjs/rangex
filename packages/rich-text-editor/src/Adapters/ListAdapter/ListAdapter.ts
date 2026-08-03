import { adapterIds } from "#ports";
import type {
	ListAdapterConstructorParams,
	ListEditorPort,
	ListInsertRequestParams,
	ListOnInsertRequestFn,
	ListToolbarButtonState,
	ListUIPort,
	ListUpdateOrderedListToolbarButtonFn,
	ListUpdateUnorderedListToolbarButtonFn,
	UpdateListStateParams,
} from "./ListAdapter-types";

export class ListAdapter {
	#orderedListToolbarButton: ListToolbarButtonState = { disabled: true };

	constructor(...params: ListAdapterConstructorParams) {
		const [_settings, _options] = params;
	}

	get id() {
		return adapterIds.list;
	}

	#unorderedListToolbarButton: ListToolbarButtonState = { disabled: true };

	#orderedListToolbarButtonListeners: Set<ListUpdateOrderedListToolbarButtonFn> =
		new Set();
	#unorderedListToolbarButtonListeners: Set<ListUpdateUnorderedListToolbarButtonFn> =
		new Set();
	#onInsertRequestListeners: Set<ListOnInsertRequestFn> = new Set();

	#uiPort: ListUIPort | null = null;
	#editorPort: ListEditorPort | null = null;

	#updateState({
		orderedListToolbarButton,
		unorderedListToolbarButton,
	}: UpdateListStateParams) {
		if (orderedListToolbarButton !== undefined) {
			this.#orderedListToolbarButton = orderedListToolbarButton;

			for (const listener of this.#orderedListToolbarButtonListeners) {
				listener(this.#orderedListToolbarButton);
			}
		}

		if (unorderedListToolbarButton !== undefined) {
			this.#unorderedListToolbarButton = unorderedListToolbarButton;

			for (const listener of this.#unorderedListToolbarButtonListeners) {
				listener(this.#unorderedListToolbarButton);
			}
		}
	}

	get uiPort(): ListUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get orderedListToolbarButton() {
				return adapter.#orderedListToolbarButton;
			},

			get unorderedListToolbarButton() {
				return adapter.#unorderedListToolbarButton;
			},

			onOrderedListToolbarButtonUpdate: (callback) => {
				adapter.#orderedListToolbarButtonListeners.add(callback);
				return () =>
					adapter.#orderedListToolbarButtonListeners.delete(callback);
			},

			onUnorderedListToolbarButtonUpdate: (callback) => {
				adapter.#unorderedListToolbarButtonListeners.add(callback);
				return () =>
					adapter.#unorderedListToolbarButtonListeners.delete(callback);
			},

			emitInsertRequest: (params: ListInsertRequestParams) => {
				for (const listener of adapter.#onInsertRequestListeners) {
					listener(params);
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): ListEditorPort {
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
