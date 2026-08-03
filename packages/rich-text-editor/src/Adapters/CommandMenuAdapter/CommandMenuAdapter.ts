import type { CommandMenuItemValue } from "#ports";
import { adapterIds, commandMenuItemsLabel } from "#ports";
import type {
	CommandMenuAdapterConstructorParams,
	CommandMenuEditorPort,
	CommandMenuOnBeforeSelectFn,
	CommandMenuUIPort,
	CommandMenuUpdateFilteredItemsFn,
	UpdateCommandMenuStateParams,
} from "./CommandMenuAdapter-types";

export class CommandMenuAdapter {
	#items: CommandMenuItemValue[];
	#allowedItems: CommandMenuItemValue[];
	#query = "";
	#filteredItems: Set<CommandMenuItemValue>;

	#filteredItemsListeners: Set<CommandMenuUpdateFilteredItemsFn> = new Set();
	#onBeforeSelectListeners: Set<CommandMenuOnBeforeSelectFn> = new Set();

	#popover: HTMLDivElement | null = null;

	#uiPort: CommandMenuUIPort | null = null;
	#editorPort: CommandMenuEditorPort | null = null;

	constructor(...params: CommandMenuAdapterConstructorParams) {
		const [{ items }, _options] = params;

		this.#items = items;
		this.#allowedItems = items;
		this.#filteredItems = new Set(items);
	}

	get id() {
		return adapterIds.commandMenu;
	}

	#computeFilteredItems() {
		const query = this.#query.toLowerCase();

		this.#filteredItems = new Set(
			this.#items.filter(
				(item) =>
					this.#allowedItems.includes(item) &&
					commandMenuItemsLabel[item].toLowerCase().includes(query),
			),
		);

		for (const listener of this.#filteredItemsListeners) {
			listener(this.#filteredItems);
		}
	}

	#updateState({ allowedItems, query }: UpdateCommandMenuStateParams) {
		let dirty = false;

		if (allowedItems !== undefined) {
			this.#allowedItems = allowedItems;
			dirty = true;
		}

		if (query !== undefined) {
			this.#query = query;
			dirty = true;
		}

		if (dirty) {
			this.#computeFilteredItems();
		}
	}

	get uiPort(): CommandMenuUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get items() {
				return adapter.#items;
			},

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

			emitBeforeSelect: () => {
				for (const listener of adapter.#onBeforeSelectListeners) {
					listener();
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): CommandMenuEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			get popover() {
				if (!adapter.#popover) {
					throw new Error("Popover wasn't set.");
				}

				return adapter.#popover;
			},

			get filteredItems() {
				return adapter.#filteredItems;
			},

			updateState: (params) => adapter.#updateState(params),

			onBeforeSelect: (callback) => {
				adapter.#onBeforeSelectListeners.add(callback);
				return () => adapter.#onBeforeSelectListeners.delete(callback);
			},
		};

		return this.#editorPort;
	}
}
