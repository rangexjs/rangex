import type {
	CreateTemplateVariableAdapterParams,
	CreateTemplateVariableAdapterResult,
	InsertParams,
	OnCanInsertUpdateCallbackFn,
	OnFilteredItemsUpdateCallbackFn,
	OnInsertCallbackFn,
	OnIsOpenUpdateCallbackFn,
	OnOptionsCallbackFn,
	OnOptionsUpdateCallbackFn,
	OnSelectCallbackFn,
	SuggestionItem,
	SuggestionItems,
	TemplateVariableConfigPort,
	TemplateVariableInternals,
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

export const createTemplateVariableAdapter = (
	...params: CreateTemplateVariableAdapterParams
): CreateTemplateVariableAdapterResult => {
	const [_settings, { floatingContainer }] = params;

	const floatingEl = document.createElement("div");
	floatingContainer.append(floatingEl);

	const internals: TemplateVariableInternals = {
		canInsert: false,
		options: { firstName: null, lastName: null, email: null, date: null },
		query: "",
		filteredItems: [],
		isOpen: false,
	};

	// ConfigPort
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	const onOptionsListeners: Set<OnOptionsCallbackFn> = new Set();
	const onSelectListeners: Set<OnSelectCallbackFn> = new Set();

	// PublicPort
	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> =
		new Set();
	const onOptionsUpdateListeners: Set<OnOptionsUpdateCallbackFn> = new Set();
	const onFilteredItemsUpdateListeners: Set<OnFilteredItemsUpdateCallbackFn> =
		new Set();
	const onIsOpenUpdateListeners: Set<OnIsOpenUpdateCallbackFn> = new Set();

	const computeFilteredItems = () => {
		const q = internals.query.toLowerCase();
		internals.filteredItems = q
			? ALL_ITEMS.filter((item) => item.label.toLowerCase().includes(q))
			: ALL_ITEMS;

		for (const listener of onFilteredItemsUpdateListeners) {
			listener(internals.filteredItems);
		}
	};

	const updateState = ({
		canInsert,
		options,
		query,
		isOpen,
	}: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			for (const listener of onCanInsertUpdateListeners) {
				listener(internals.canInsert);
			}
		}

		if (options !== undefined) {
			internals.options = options;

			for (const listener of onOptionsUpdateListeners) {
				listener(internals.options);
			}
		}

		if (query !== undefined) {
			internals.query = query;
			computeFilteredItems();
		}

		if (isOpen !== undefined) {
			internals.isOpen = isOpen;

			for (const listener of onIsOpenUpdateListeners) {
				listener(internals.isOpen);
			}
		}
	};

	const configPort: TemplateVariableConfigPort = {
		get floatingEl() {
			return floatingEl;
		},

		updateState(params) {
			updateState(params);
		},

		onInsert(callback) {
			onInsertListeners.add(callback);
			return () => onInsertListeners.delete(callback);
		},

		onOptions(callback) {
			onOptionsListeners.add(callback);
			return () => onOptionsListeners.delete(callback);
		},

		onSelect(callback) {
			onSelectListeners.add(callback);
			return () => onSelectListeners.delete(callback);
		},
	};

	const publicPort: TemplateVariablePublicPort = {
		get floatingEl() {
			return floatingEl;
		},

		get canInsert() {
			return internals.canInsert;
		},

		get options() {
			return internals.options;
		},

		get filteredItems() {
			return internals.filteredItems;
		},

		get isOpen() {
			return internals.isOpen;
		},

		onCanInsertUpdate(callback) {
			onCanInsertUpdateListeners.add(callback);
			return () => onCanInsertUpdateListeners.delete(callback);
		},

		onOptionsUpdate(callback) {
			onOptionsUpdateListeners.add(callback);
			return () => onOptionsUpdateListeners.delete(callback);
		},

		onFilteredItemsUpdate(callback) {
			onFilteredItemsUpdateListeners.add(callback);
			return () => onFilteredItemsUpdateListeners.delete(callback);
		},

		onIsOpenUpdate(callback) {
			onIsOpenUpdateListeners.add(callback);
			return () => onIsOpenUpdateListeners.delete(callback);
		},

		insert(params: InsertParams) {
			for (const listener of onInsertListeners) {
				listener(params);
			}
		},

		changeOptions(options) {
			for (const listener of onOptionsListeners) {
				listener(options);
			}
		},

		select(item: SuggestionItem) {
			for (const listener of onSelectListeners) {
				listener(item);
			}
		},
	};

	return { configPort, publicPort };
};
