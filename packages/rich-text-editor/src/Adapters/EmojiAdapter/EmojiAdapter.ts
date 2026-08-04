import { adapterIds } from "#ports";
import { EmojiPopover } from "#ui-extensions";
import { createOverlayMount, type OverlayMount } from "../_Utilities";
import type {
	EmojiAdapterConstructorParams,
	EmojiEditorPort,
	EmojiItems,
	EmojiOnSelectFn,
	EmojiUIPort,
	EmojiUpdateFilteredItemsFn,
	EmojiUpdateIsOpenFn,
	UpdateEmojiStateParams,
} from "./EmojiAdapter-types";

const MAX_RESULTS = 8;

export class EmojiAdapter {
	#overlayMount: OverlayMount;
	#items: EmojiItems;
	#query = "";
	#filteredItems: EmojiItems = [];
	#isOpen = false;

	#filteredItemsListeners: Set<EmojiUpdateFilteredItemsFn> = new Set();
	#isOpenListeners: Set<EmojiUpdateIsOpenFn> = new Set();
	#onSelectListeners: Set<EmojiOnSelectFn> = new Set();

	#uiPort: EmojiUIPort | null = null;
	#editorPort: EmojiEditorPort | null = null;

	constructor(...params: EmojiAdapterConstructorParams) {
		const [settings, { overlayHost }] = params;

		this.#items = settings.items;

		this.#overlayMount = createOverlayMount({
			overlayHost,
			component: EmojiPopover,
			props: { uiPort: this.uiPort },
		});
	}

	get id() {
		return adapterIds.emoji;
	}

	#computeFilteredItems() {
		const q = this.#query.toLowerCase();
		const matches = q
			? this.#items.filter((item) => item.name.toLowerCase().includes(q))
			: [];

		this.#filteredItems = matches.slice(0, MAX_RESULTS);

		for (const listener of this.#filteredItemsListeners) {
			listener(this.#filteredItems);
		}
	}

	#updateState({ query, isOpen }: UpdateEmojiStateParams) {
		if (query !== undefined) {
			this.#query = query;
			this.#computeFilteredItems();
		}

		if (isOpen !== undefined) {
			this.#isOpen = isOpen;

			for (const listener of this.#isOpenListeners) {
				listener(this.#isOpen);
			}
		}
	}

	get uiPort(): EmojiUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get anchoredOverlay() {
				return adapter.#overlayMount.uiOverlayMount;
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

	get editorPort(): EmojiEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			get anchoredOverlay() {
				return adapter.#overlayMount.editorOverlayMount;
			},

			get filteredItems() {
				return adapter.#filteredItems;
			},

			updateState: (params) => adapter.#updateState(params),

			onSelect: (callback) => {
				adapter.#onSelectListeners.add(callback);
				return () => adapter.#onSelectListeners.delete(callback);
			},

			findByName: (name) => {
				return adapter.#items.find((item) => item.name === name.toLowerCase());
			},
		};

		return this.#editorPort;
	}
}
