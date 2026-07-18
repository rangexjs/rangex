import type {
	MentionItems,
	MentionOnSelectFn,
	MentionPort,
	MentionSuggestionItem,
	UpdateMentionPopoverStateParams,
} from "#ports";
import { assertNever } from "../../ErrorHandling";
import type {
	MentionListenerOption,
	MentionUpdateFilteredItemsFn,
	MentionUpdateItemsFn,
	MentionUpdateListenerParams,
	MentionUpdateQueryFn,
} from "./MentionPopoverController-types";

export class MentionPopoverController {
	#popover: HTMLDivElement | null = null;
	#items: MentionItems = [];
	#query = "";
	#filteredItems: MentionItems = [];

	#itemsListeners: Set<MentionUpdateItemsFn> = new Set();
	#queryListeners: Set<MentionUpdateQueryFn> = new Set();
	#filteredItemsListeners: Set<MentionUpdateFilteredItemsFn> = new Set();

	#onSelectListeners: Set<MentionOnSelectFn> = new Set();

	get items() {
		return this.#items;
	}

	get query() {
		return this.#query;
	}

	get filteredItems() {
		return this.#filteredItems;
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

	#updateListener({ type, callback, operation }: MentionUpdateListenerParams) {
		if (type === "items") {
			this.#itemsListeners[operation](callback);
			return;
		}

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

	subscribe(params: MentionListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: MentionListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	emitSelect(item: MentionSuggestionItem) {
		for (const listener of this.#onSelectListeners) {
			listener(item);
		}
	}

	updateState({ items, query }: UpdateMentionPopoverStateParams) {
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

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): MentionPort {
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
		};
	}
}
