import type { CommandMenuItemValue } from "#ports";
import { adapterIds, commandMenuItemsLabel } from "#ports";
import { defaultCommandMenuItems } from "./CommandMenuAdapter-default";
import type {
	CommandMenuAdapterConstructorParams,
	CommandMenuEditorPort,
	CommandMenuOnBeforeSelectFn,
	CommandMenuUIPort,
	CommandMenuUpdateFilteredItemsFn,
	CommandMenuUpdateIsOpenFn,
	UpdateCommandMenuStateParams,
} from "./CommandMenuAdapter-types";

export class CommandMenuAdapter {
	#items: CommandMenuItemValue[];
	#allowedItems: CommandMenuItemValue[];
	#query = "";
	#filteredItems: Set<CommandMenuItemValue>;
	#isOpen = false;

	#filteredItemsListeners: Set<CommandMenuUpdateFilteredItemsFn> = new Set();
	#isOpenListeners: Set<CommandMenuUpdateIsOpenFn> = new Set();
	#onBeforeSelectListeners: Set<CommandMenuOnBeforeSelectFn> = new Set();

	#anchoredOverlay: HTMLDivElement | null = null;

	#uiPort: CommandMenuUIPort | null = null;
	#editorPort: CommandMenuEditorPort | null = null;

	constructor(...params: CommandMenuAdapterConstructorParams) {
		const [{ items = defaultCommandMenuItems }, _options] = params;

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

	#updateState({ allowedItems, query, isOpen }: UpdateCommandMenuStateParams) {
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

		if (isOpen !== undefined) {
			this.#isOpen = isOpen;

			for (const listener of this.#isOpenListeners) {
				listener(this.#isOpen);
			}
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

			get isOpen() {
				return adapter.#isOpen;
			},

			onIsOpenUpdate: (callback) => {
				adapter.#isOpenListeners.add(callback);
				return () => adapter.#isOpenListeners.delete(callback);
			},

			setAnchoredOverlay: (element) => {
				adapter.#anchoredOverlay = element;
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
			get anchoredOverlay() {
				if (!adapter.#anchoredOverlay) {
					throw new Error("AnchoredOverlay wasn't set.");
				}

				return adapter.#anchoredOverlay;
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
