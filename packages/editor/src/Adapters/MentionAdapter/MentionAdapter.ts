import { extendObjectProperties } from "#utilities";
import { createCaretMenuPort } from "../_Utilities";
import type {
	CreateMentionAdapterParams,
	CreateMentionAdapterResult,
	MentionConfigPort,
	MentionConfigPortProps,
	MentionInternals,
	MentionPublicPort,
	MentionPublicPortProps,
	OnFilteredItemsUpdateCallbackFn,
	OnSelectCallbackFn,
	SuggestionItem,
	UpdateStateParams,
} from "./MentionAdapter-types";

export const createMentionAdapter = (
	...params: CreateMentionAdapterParams
): CreateMentionAdapterResult => {
	const [_settings, { floatingContainer }] = params;

	const internals: MentionInternals = {
		// States
		items: [],
		query: "",
		filteredItems: [],
	};

	// StateListeners
	const onFilteredItemsUpdateListeners: Set<OnFilteredItemsUpdateCallbackFn> =
		new Set();

	// CommandListeners
	const onSelectListeners: Set<OnSelectCallbackFn> = new Set();

	const caretMenuPort = createCaretMenuPort({ floatingContainer });

	const computeFilteredItems = () => {
		const q = internals.query.toLowerCase();
		internals.filteredItems = q
			? internals.items.filter(
					(item) =>
						item.name.toLowerCase().includes(q) ||
						item.username.toLowerCase().includes(q),
				)
			: internals.items;

		for (const listener of onFilteredItemsUpdateListeners) {
			listener(internals.filteredItems);
		}
	};

	const updateState = ({ items, query }: UpdateStateParams) => {
		let dirty = false;

		if (items !== undefined) {
			internals.items = items;
			dirty = true;
		}

		if (query !== undefined) {
			internals.query = query;
			dirty = true;
		}

		if (dirty) {
			computeFilteredItems();
		}
	};

	const configPort: MentionConfigPort = extendObjectProperties(
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
		} satisfies MentionConfigPortProps,
	);

	const publicPort: MentionPublicPort = extendObjectProperties(
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
		} satisfies MentionPublicPortProps,
	);

	return { configPort, publicPort };
};
