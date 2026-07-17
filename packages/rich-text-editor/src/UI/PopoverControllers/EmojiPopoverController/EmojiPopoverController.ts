import { assertNever } from "../../ErrorHandling";
import { emojiData } from "./EmojiData";
import type {
	EmojiItems,
	EmojiListenerOption,
	EmojiOnSelectFn,
	EmojiPopover,
	EmojiSuggestionItem,
	EmojiUpdateFilteredItemsFn,
	EmojiUpdateListenerParams,
	EmojiUpdateQueryFn,
	UpdateEmojiPopoverStateParams,
} from "./EmojiPopoverController-types";

const MAX_RESULTS = 8;

export class EmojiPopoverController {
	#popover: HTMLDivElement | null = null;
	#items: EmojiItems = emojiData;
	#query = "";
	#filteredItems: EmojiItems = [];

	#queryListeners: Set<EmojiUpdateQueryFn> = new Set();
	#filteredItemsListeners: Set<EmojiUpdateFilteredItemsFn> = new Set();

	#onSelectListeners: Set<EmojiOnSelectFn> = new Set();

	get query() {
		return this.#query;
	}

	get filteredItems() {
		return this.#filteredItems;
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

	#updateListener({ type, callback, operation }: EmojiUpdateListenerParams) {
		if (type === "query") {
			this.#queryListeners[operation](callback);
			return;
		}

		if (type === "filteredItems") {
			this.#filteredItemsListeners[operation](callback);
			return;
		}

		assertNever(type);
	}

	subscribe(params: EmojiListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: EmojiListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	emitSelect(item: EmojiSuggestionItem) {
		for (const listener of this.#onSelectListeners) {
			listener(item);
		}
	}

	updateState({ query }: UpdateEmojiPopoverStateParams) {
		if (query !== undefined) {
			this.#query = query;

			for (const listener of this.#queryListeners) {
				listener(this.#query);
			}

			this.#computeFilteredItems();
		}
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): EmojiPopover {
		const controller = this;

		return {
			get popover() {
				if (!controller.#popover) {
					throw new Error("PopoverNode shouldn't be null.");
				}

				return controller.#popover;
			},

			get filteredItems() {
				return controller.#filteredItems;
			},

			updateState: (params) => this.updateState(params),

			onSelect: (callback) => {
				this.#onSelectListeners.add(callback);
				return () => this.#onSelectListeners.delete(callback);
			},

			findByName: (name) => {
				return controller.#items.find(
					(item) => item.name === name.toLowerCase(),
				);
			},
		};
	}
}
