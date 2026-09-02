import type {
	ConstructorParams,
	InsertParams,
	OnCanInsertUpdateCallbackFn,
	OnFilteredItemsUpdateCallbackFn,
	OnInsertCallbackFn,
	OnIsOpenUpdateCallbackFn,
	OnOptionsCallbackFn,
	OnOptionsUpdateCallbackFn,
	OnSelectCallbackFn,
	Options,
	SuggestionItem,
	SuggestionItems,
	TemplateVariableConfigPort,
	TemplateVariablePublicPort,
	UpdateStateParams,
} from "./TemplateVariableAdapter-types";

const ALL_ITEMS: SuggestionItems = [
	{ kind: "full-name", label: "{{FullName}}" },
	{ kind: "first-name", label: "{{FirstName}}" },
	{ kind: "last-name", label: "{{LastName}}" },
	{ kind: "email", label: "{{Email}}" },
	{ kind: "date", label: "{{Date}}" },
];

export class TemplateVariableAdapter {
	#floatingEl = document.createElement("div");

	#canInsert = false;
	#options: Options = {
		firstName: null,
		lastName: null,
		email: null,
		date: null,
	};
	#query = "";
	#filteredItems: SuggestionItems = [];
	#isOpen = false;

	// ConfigPort
	#onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	#onOptionsListeners: Set<OnOptionsCallbackFn> = new Set();
	#onSelectListeners: Set<OnSelectCallbackFn> = new Set();

	// PublicPort
	#onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> = new Set();
	#onOptionsUpdateListeners: Set<OnOptionsUpdateCallbackFn> = new Set();
	#onFilteredItemsUpdateListeners: Set<OnFilteredItemsUpdateCallbackFn> =
		new Set();
	#onIsOpenUpdateListeners: Set<OnIsOpenUpdateCallbackFn> = new Set();

	#configPort: TemplateVariableConfigPort | null = null;
	#publicPort: TemplateVariablePublicPort | null = null;

	constructor(...params: ConstructorParams) {
		const [_settings, { floatingContainer }] = params;

		floatingContainer.append(this.#floatingEl);
	}

	#computeFilteredItems() {
		const q = this.#query.toLowerCase();
		this.#filteredItems = q
			? ALL_ITEMS.filter((item) => item.label.toLowerCase().includes(q))
			: ALL_ITEMS;

		for (const listener of this.#onFilteredItemsUpdateListeners) {
			listener(this.#filteredItems);
		}
	}

	#updateState({ canInsert, options, query, isOpen }: UpdateStateParams) {
		if (canInsert !== undefined) {
			this.#canInsert = canInsert;

			for (const listener of this.#onCanInsertUpdateListeners) {
				listener(this.#canInsert);
			}
		}

		if (options !== undefined) {
			this.#options = options;

			for (const listener of this.#onOptionsUpdateListeners) {
				listener(this.#options);
			}
		}

		if (query !== undefined) {
			this.#query = query;
			this.#computeFilteredItems();
		}

		if (isOpen !== undefined) {
			this.#isOpen = isOpen;

			for (const listener of this.#onIsOpenUpdateListeners) {
				listener(this.#isOpen);
			}
		}
	}

	get configPort(): TemplateVariableConfigPort {
		const adapter = this;

		this.#configPort ??= {
			get floatingEl() {
				return adapter.#floatingEl;
			},

			updateState(params) {
				adapter.#updateState(params);
			},

			onInsert(callback) {
				adapter.#onInsertListeners.add(callback);
				return () => adapter.#onInsertListeners.delete(callback);
			},

			onOptions(callback) {
				adapter.#onOptionsListeners.add(callback);
				return () => adapter.#onOptionsListeners.delete(callback);
			},

			onSelect(callback) {
				adapter.#onSelectListeners.add(callback);
				return () => adapter.#onSelectListeners.delete(callback);
			},
		};

		return this.#configPort;
	}

	get publicPort(): TemplateVariablePublicPort {
		const adapter = this;

		this.#publicPort ??= {
			get floatingEl() {
				return adapter.#floatingEl;
			},

			get canInsert() {
				return adapter.#canInsert;
			},

			get options() {
				return adapter.#options;
			},

			get filteredItems() {
				return adapter.#filteredItems;
			},

			get isOpen() {
				return adapter.#isOpen;
			},

			onCanInsertUpdate(callback) {
				adapter.#onCanInsertUpdateListeners.add(callback);
				return () => adapter.#onCanInsertUpdateListeners.delete(callback);
			},

			onOptionsUpdate(callback) {
				adapter.#onOptionsUpdateListeners.add(callback);
				return () => adapter.#onOptionsUpdateListeners.delete(callback);
			},

			onFilteredItemsUpdate(callback) {
				adapter.#onFilteredItemsUpdateListeners.add(callback);
				return () => adapter.#onFilteredItemsUpdateListeners.delete(callback);
			},

			onIsOpenUpdate(callback) {
				adapter.#onIsOpenUpdateListeners.add(callback);
				return () => adapter.#onIsOpenUpdateListeners.delete(callback);
			},

			insert(params: InsertParams) {
				for (const listener of adapter.#onInsertListeners) {
					listener(params);
				}
			},

			changeOptions(options) {
				for (const listener of adapter.#onOptionsListeners) {
					listener(options);
				}
			},

			select(item: SuggestionItem) {
				for (const listener of adapter.#onSelectListeners) {
					listener(item);
				}
			},
		};

		return this.#publicPort;
	}
}
