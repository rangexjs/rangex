import { extendObjectProperties } from "#utilities";
import { createCaretMenuPort, createEmitter } from "../_Utilities";
import type {
	CommandMenuConfigPort,
	CommandMenuConfigPortProps,
	CommandMenuInternals,
	CommandMenuItemValue,
	CommandMenuPublicPort,
	CommandMenuPublicPortProps,
	CreateCommandMenuAdapterParams,
	CreateCommandMenuAdapterResult,
	OnBeforeSelectCallbackFn,
	OnFilteredItemsUpdateCallbackFn,
	SuggestionItems,
	UpdateStateParams,
} from "./CommandMenuAdapter-types";

const ALL_ITEMS: SuggestionItems = [
	{ value: "p", label: "Text" },
	{ value: "h1", label: "Heading 1" },
	{ value: "h2", label: "Heading 2" },
	{ value: "h3", label: "Heading 3" },
	{ value: "h4", label: "Heading 4" },
	{ value: "h5", label: "Heading 5" },
	{ value: "h6", label: "Heading 6" },
	{ value: "bulleted-list", label: "Bulleted list" },
	{ value: "numbered-list", label: "Numbered list" },
	{ value: "todo-list", label: "Todo list" },
	{ value: "block-quote", label: "Blockquote" },
	{ value: "code-block", label: "Code block" },
	{ value: "table", label: "Table" },
	{ value: "media", label: "Media" },
	{ value: "accordion-item", label: "Accordion item" },
	{ value: "separator", label: "Separator" },
];

const resolveItems = (
	values: CommandMenuItemValue[] | undefined,
): SuggestionItems => {
	if (!values) {
		return ALL_ITEMS;
	}

	const items: SuggestionItems = [];

	for (const value of values) {
		const item = ALL_ITEMS.find((candidate) => candidate.value === value);

		if (item) {
			items.push(item);
		}
	}

	return items;
};

export const createCommandMenuAdapter = (
	...params: CreateCommandMenuAdapterParams
): CreateCommandMenuAdapterResult => {
	const [{ items }, { floatingContainer }] = params;

	const resolvedItems = resolveItems(items);

	const internals: CommandMenuInternals = {
		// States
		query: "",
		filteredItems: resolvedItems,
		// Rest
		items: resolvedItems,
	};

	// StateListeners
	const filteredItemsUpdateEmitter =
		createEmitter<OnFilteredItemsUpdateCallbackFn>();

	// CommandListeners
	const beforeSelectEmitter = createEmitter<OnBeforeSelectCallbackFn>();

	const caretMenuPort = createCaretMenuPort({ floatingContainer });

	const computeFilteredItems = () => {
		const query = internals.query.toLowerCase();

		internals.filteredItems = query
			? internals.items.filter((item) =>
					item.label.toLowerCase().includes(query),
				)
			: internals.items;

		filteredItemsUpdateEmitter.emit(internals.filteredItems);
	};

	const updateState = ({ query }: UpdateStateParams) => {
		if (query !== undefined) {
			internals.query = query;
			computeFilteredItems();
		}
	};

	const configPort: CommandMenuConfigPort = extendObjectProperties({}, {
		get caretMenu() {
			return caretMenuPort.configPort;
		},

		get filteredItems() {
			return internals.filteredItems;
		},

		updateState(params) {
			updateState(params);
		},

		onBeforeSelect(callback) {
			return beforeSelectEmitter.subscribe(callback);
		},
	} satisfies CommandMenuConfigPortProps);

	const publicPort: CommandMenuPublicPort = extendObjectProperties({}, {
		get caretMenu() {
			return caretMenuPort.publicPort;
		},

		get filteredItems() {
			return internals.filteredItems;
		},

		onFilteredItemsUpdate(callback) {
			return filteredItemsUpdateEmitter.subscribe(callback);
		},

		beforeSelect() {
			beforeSelectEmitter.emit();
		},
	} satisfies CommandMenuPublicPortProps);

	return { configPort, publicPort };
};
