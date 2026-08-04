import { adapterIds } from "#ports";
import { MentionPopover } from "#ui-extensions";
import { createOverlayMount, type OverlayMount } from "../_Utilities";
import type {
	MentionAdapterConstructorParams,
	MentionEditorPort,
	MentionItems,
	MentionOnSelectFn,
	MentionUIPort,
	MentionUpdateFilteredItemsFn,
	MentionUpdateIsOpenFn,
	MentionUpdateItemsFn,
	MentionUpdateQueryFn,
	UpdateMentionStateParams,
} from "./MentionAdapter-types";

export class MentionAdapter {
	#anchoredOverlayMount: OverlayMount;
	#items: MentionItems = [];
	#query = "";
	#filteredItems: MentionItems = [];
	#isOpen = false;

	#itemsListeners: Set<MentionUpdateItemsFn> = new Set();
	#queryListeners: Set<MentionUpdateQueryFn> = new Set();
	#filteredItemsListeners: Set<MentionUpdateFilteredItemsFn> = new Set();
	#isOpenListeners: Set<MentionUpdateIsOpenFn> = new Set();

	#onSelectListeners: Set<MentionOnSelectFn> = new Set();

	#uiPort: MentionUIPort | null = null;
	#editorPort: MentionEditorPort | null = null;

	constructor(...params: MentionAdapterConstructorParams) {
		const [_settings, { overlayHost }] = params;

		this.#anchoredOverlayMount = createOverlayMount({
			overlayHost,
			component: MentionPopover,
			props: { uiPort: this.uiPort },
		});
	}

	get id() {
		return adapterIds.mention;
	}

	#computeFilteredItems() {
		const q = this.#query.toLowerCase();
		this.#filteredItems = q
			? this.#items.filter(
					(item) =>
						item.name.toLowerCase().includes(q) ||
						item.username.toLowerCase().includes(q),
				)
			: this.#items;

		for (const listener of this.#filteredItemsListeners) {
			listener(this.#filteredItems);
		}
	}

	#updateState({ items, query, isOpen }: UpdateMentionStateParams) {
		let dirty = false;

		if (items !== undefined) {
			this.#items = items;
			dirty = true;

			for (const listener of this.#itemsListeners) {
				listener(this.#items);
			}
		}

		if (query !== undefined) {
			this.#query = query;
			dirty = true;

			for (const listener of this.#queryListeners) {
				listener(this.#query);
			}
		}

		if (dirty) {
			this.#computeFilteredItems();
		}

		if (isOpen !== undefined) {
			this.#isOpen = isOpen;

			for (const listener of this.#isOpenListeners) {
				listener(this.#isOpen);
			}
		}
	}

	get uiPort(): MentionUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get anchoredOverlay() {
				return adapter.#anchoredOverlayMount.uiOverlayMount;
			},

			get filteredItems() {
				return adapter.#filteredItems;
			},

			onFilteredItemsUpdate: (callback) => {
				adapter.#filteredItemsListeners.add(callback);
				return () => adapter.#filteredItemsListeners.delete(callback);
			},

			get isOpen() {
				return adapter.#isOpen;
			},

			onIsOpenUpdate: (callback) => {
				adapter.#isOpenListeners.add(callback);
				return () => adapter.#isOpenListeners.delete(callback);
			},

			emitSelect: (item) => {
				for (const listener of adapter.#onSelectListeners) {
					listener(item);
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): MentionEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			get anchoredOverlay() {
				return adapter.#anchoredOverlayMount.editorOverlayMount;
			},

			get filteredItems() {
				return adapter.#filteredItems;
			},

			updateState: (params) => adapter.#updateState(params),

			onSelect: (callback) => {
				adapter.#onSelectListeners.add(callback);
				return () => adapter.#onSelectListeners.delete(callback);
			},
		};

		return this.#editorPort;
	}
}
