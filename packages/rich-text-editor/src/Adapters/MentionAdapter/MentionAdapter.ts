import type {
	MentionAdapterConstructorParams,
	MentionEditorPort,
	MentionItems,
	MentionOnSelectFn,
	MentionUIPort,
	MentionUpdateFilteredItemsFn,
	MentionUpdateItemsFn,
	MentionUpdateQueryFn,
	UpdateMentionStateParams,
} from "./MentionAdapter-types";

export class MentionAdapter {
	#popover: HTMLDivElement | null = null;
	#items: MentionItems = [];
	#query = "";
	#filteredItems: MentionItems = [];

	#itemsListeners: Set<MentionUpdateItemsFn> = new Set();
	#queryListeners: Set<MentionUpdateQueryFn> = new Set();
	#filteredItemsListeners: Set<MentionUpdateFilteredItemsFn> = new Set();

	#onSelectListeners: Set<MentionOnSelectFn> = new Set();

	// biome-ignore lint/complexity/noUselessConstructor: Allowed for adapters
	// biome-ignore lint/suspicious/noEmptyBlockStatements: Allowed for adapters
	constructor(_params: MentionAdapterConstructorParams) {}

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

	#updateState({ items, query }: UpdateMentionStateParams) {
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
	}

	get uiPort(): MentionUIPort {
		const adapter = this;

		return {
			get filteredItems() {
				return adapter.#filteredItems;
			},

			onFilteredItemsUpdate: (callback) => {
				adapter.#filteredItemsListeners.add(callback);
				return () => adapter.#filteredItemsListeners.delete(callback);
			},

			setPopover: (element) => {
				adapter.#popover = element;
			},

			emitSelect: (item) => {
				for (const listener of adapter.#onSelectListeners) {
					listener(item);
				}
			},
		};
	}

	get editorPort(): MentionEditorPort {
		const adapter = this;

		return {
			get popover() {
				if (!adapter.#popover) {
					throw new Error("PopoverNode shouldn't be null.");
				}

				return adapter.#popover;
			},

			get filteredItems() {
				return adapter.#filteredItems;
			},

			updateState: (params) => this.#updateState(params),

			onSelect: (callback) => {
				this.#onSelectListeners.add(callback);
				return () => this.#onSelectListeners.delete(callback);
			},
		};
	}
}
