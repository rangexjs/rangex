import { extendObjectProperties } from "#utilities";
import {
	createCaretMenuPort,
	createEmitter,
	createUnwrapPort,
} from "../_Utilities";
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
	const filteredItemsUpdateEmitter =
		createEmitter<OnFilteredItemsUpdateCallbackFn>();

	// CommandListeners
	const selectEmitter = createEmitter<OnSelectCallbackFn>();

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

		filteredItemsUpdateEmitter.emit(internals.filteredItems);
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

	const unwrapPort = createUnwrapPort();

	const configPort: MentionConfigPort = extendObjectProperties(
		unwrapPort.configPort,
		{
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
		} satisfies MentionConfigPortProps,
	);

	const publicPort: MentionPublicPort = extendObjectProperties(
		unwrapPort.publicPort,
		{
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
		} satisfies MentionPublicPortProps,
	);

	return { configPort, publicPort };
};
