import type {
	CaretMenuConfigPort,
	CaretMenuPublicPort,
	CreateAdapterParams,
} from "../_Utilities";

export interface SuggestionItem {
	emoji: string;
	name: string;
}

export type SuggestionItems = SuggestionItem[];

export interface EmojiState {
	query?: string;
}

export interface UpdateStateParams extends EmojiState {}

export type OnSelectCallbackFn = (item: SuggestionItem) => void;

export interface EmojiConfigPortProps {
	readonly filteredItems: SuggestionItems;

	updateState(params: UpdateStateParams): void;

	onSelect(callback: OnSelectCallbackFn): () => void;

	findByName(name: string): SuggestionItem | undefined;
}

export interface EmojiConfigPort
	extends EmojiConfigPortProps,
		CaretMenuConfigPort {}

export type OnFilteredItemsUpdateCallbackFn = (value: SuggestionItems) => void;

export interface EmojiPublicPortProps {
	readonly filteredItems: SuggestionItems;

	onFilteredItemsUpdate(callback: OnFilteredItemsUpdateCallbackFn): () => void;

	select(item: SuggestionItem): void;
}

export interface EmojiPublicPort
	extends EmojiPublicPortProps,
		CaretMenuPublicPort {}

export interface EmojiInternals {
	items: SuggestionItems;
	query: string;
	filteredItems: SuggestionItems;
}

export interface EmojiAdapter {
	configPort: EmojiConfigPort;
	publicPort: EmojiPublicPort;
}

export interface EmojiSettings {
	items?: SuggestionItems;
}

export interface CreateEmojiAdapterParams
	extends CreateAdapterParams<EmojiSettings> {}

export interface CreateEmojiAdapterResult extends EmojiAdapter {}
