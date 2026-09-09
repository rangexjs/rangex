import { extendObjectProperties } from "#utilities";
import { createCaretMenuPort } from "../_Utilities";
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
		items,
		query: "",
		filteredItems: [],
	};

	// ConfigPort
	const onSelectListeners: Set<OnSelectCallbackFn> = new Set();

	// PublicPort
	const onFilteredItemsUpdateListeners: Set<OnFilteredItemsUpdateCallbackFn> =
		new Set();

	const caretMenuPort = createCaretMenuPort({ floatingContainer });

	const computeFilteredItems = () => {
		const q = internals.query.toLowerCase();
		const matches = q
			? internals.items.filter((item) => item.name.toLowerCase().includes(q))
			: [];

		internals.filteredItems = matches.slice(0, MAX_RESULTS);

		for (const listener of onFilteredItemsUpdateListeners) {
			listener(internals.filteredItems);
		}
	};

	const updateState = ({ query }: UpdateStateParams) => {
		if (query !== undefined) {
			internals.query = query;
			computeFilteredItems();
		}
	};

	const configPort: EmojiConfigPort = extendObjectProperties(
		caretMenuPort.configPort,
		{
			get filteredItems() {
				return internals.filteredItems;
			},

			updateState(params) {
				updateState(params);
			},

			onSelect(callback) {
				onSelectListeners.add(callback);
				return () => onSelectListeners.delete(callback);
			},

			findByName(name) {
				return internals.items.find((item) => item.name === name.toLowerCase());
			},
		} satisfies EmojiConfigPortProps,
	);

	const publicPort: EmojiPublicPort = extendObjectProperties(
		caretMenuPort.publicPort,
		{
			get filteredItems() {
				return internals.filteredItems;
			},

			onFilteredItemsUpdate(callback) {
				onFilteredItemsUpdateListeners.add(callback);
				return () => onFilteredItemsUpdateListeners.delete(callback);
			},

			select(item: SuggestionItem) {
				for (const listener of onSelectListeners) {
					listener(item);
				}
			},
		} satisfies EmojiPublicPortProps,
	);

	return { configPort, publicPort };
};
