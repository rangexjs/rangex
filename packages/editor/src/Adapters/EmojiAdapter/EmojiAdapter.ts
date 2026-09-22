import { extendObjectProperties } from "#utilities";
import { createCaretMenuPort, createEmitter } from "../_Utilities";
import { defaultEmojiItems } from "./EmojiAdapter-default";
import type {
	CreateEmojiAdapterParams,
	CreateEmojiAdapterResult,
	EmojiConfigPort,
	EmojiConfigPortProps,
	EmojiInternals,
	EmojiPublicPort,
	EmojiPublicPortProps,
	OnFilteredItemsUpdateCallbackFn,
	OnSelectCallbackFn,
	SuggestionItem,
	UpdateStateParams,
} from "./EmojiAdapter-types";

const MAX_RESULTS = 8;

export const createEmojiAdapter = (
	...params: CreateEmojiAdapterParams
): CreateEmojiAdapterResult => {
	const [{ items = defaultEmojiItems }, { floatingContainer }] = params;

	const internals: EmojiInternals = {
		// States
		query: "",
		filteredItems: [],
		// Rest
		items,
	};

	// StateListeners
	const filteredItemsUpdateEmitter =
		createEmitter<OnFilteredItemsUpdateCallbackFn>();

	// CommandListeners
	const selectEmitter = createEmitter<OnSelectCallbackFn>();

	const caretMenuPort = createCaretMenuPort({ floatingContainer });

	const computeFilteredItems = () => {
		const q = internals.query.toLowerCase();
		const matches = q
			? internals.items.filter((item) => item.name.toLowerCase().includes(q))
			: [];

		internals.filteredItems = matches.slice(0, MAX_RESULTS);

		filteredItemsUpdateEmitter.emit(internals.filteredItems);
	};

	const updateState = ({ query }: UpdateStateParams) => {
		if (query !== undefined) {
			internals.query = query;
			computeFilteredItems();
		}
	};

	const configPort: EmojiConfigPort = extendObjectProperties({}, {
		get caretMenu() {
			return caretMenuPort.configPort;
		},

		get filteredItems() {
			return internals.filteredItems;
		},

		updateState(params) {
			updateState(params);
		},

		onSelect(callback) {
			return selectEmitter.subscribe(callback);
		},

		findByName(name) {
			return internals.items.find((item) => item.name === name.toLowerCase());
		},
	} satisfies EmojiConfigPortProps);

	const publicPort: EmojiPublicPort = extendObjectProperties({}, {
		get caretMenu() {
			return caretMenuPort.publicPort;
		},

		get filteredItems() {
			return internals.filteredItems;
		},

		onFilteredItemsUpdate(callback) {
			return filteredItemsUpdateEmitter.subscribe(callback);
		},

		select(item: SuggestionItem) {
			selectEmitter.emit(item);
		},
	} satisfies EmojiPublicPortProps);

	return { configPort, publicPort };
};
