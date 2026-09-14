import { extendObjectProperties } from "#utilities";
import { createCaretMenuPort } from "../_Utilities";
import type {
	CreateTemplateVariableAdapterParams,
	CreateTemplateVariableAdapterResult,
	InsertParams,
	OnCanInsertUpdateCallbackFn,
	OnFilteredItemsUpdateCallbackFn,
	OnInsertCallbackFn,
	OnOptionsCallbackFn,
	OnOptionsUpdateCallbackFn,
	OnSelectCallbackFn,
	SuggestionItem,
	SuggestionItems,
	TemplateVariableConfigPort,
	TemplateVariableConfigPortProps,
	TemplateVariableInternals,
	TemplateVariablePublicPort,
	TemplateVariablePublicPortProps,
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

	const internals: TemplateVariableInternals = {
		// States
		canInsert: false,
		options: { firstName: null, lastName: null, email: null, date: null },
		query: "",
		filteredItems: [],
	};

	// StateListeners
	const onCanInsertUpdateListeners: Set<OnCanInsertUpdateCallbackFn> =
		new Set();
	const onOptionsUpdateListeners: Set<OnOptionsUpdateCallbackFn> = new Set();
	const onFilteredItemsUpdateListeners: Set<OnFilteredItemsUpdateCallbackFn> =
		new Set();

	// CommandListeners
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();
	const onOptionsListeners: Set<OnOptionsCallbackFn> = new Set();
	const onSelectListeners: Set<OnSelectCallbackFn> = new Set();

	const caretMenuPort = createCaretMenuPort({ floatingContainer });

	const computeFilteredItems = () => {
		const q = internals.query.toLowerCase();
		internals.filteredItems = q
			? ALL_ITEMS.filter((item) => item.label.toLowerCase().includes(q))
			: ALL_ITEMS;

		for (const listener of onFilteredItemsUpdateListeners) {
			listener(internals.filteredItems);
		}
	};

	const updateState = ({ canInsert, options, query }: UpdateStateParams) => {
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
	};

	const configPort: TemplateVariableConfigPort = extendObjectProperties({}, {
		get caretMenu() {
			return caretMenuPort.configPort;
		},

		get filteredItems() {
			return internals.filteredItems;
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
	} satisfies TemplateVariableConfigPortProps);

	const publicPort: TemplateVariablePublicPort = extendObjectProperties({}, {
		get caretMenu() {
			return caretMenuPort.publicPort;
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
	} satisfies TemplateVariablePublicPortProps);

	return { configPort, publicPort };
};
