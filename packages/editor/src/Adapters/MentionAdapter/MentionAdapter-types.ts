import type {
	CaretMenuConfigPort,
	CaretMenuPublicPort,
	CreateAdapterParams,
	UnwrapConfigPort,
	UnwrapPublicPort,
} from "../_Utilities";

export interface SuggestionItem {
	id: string;
	img: string;
	name: string;
	username: string;
}

export type SuggestionItems = SuggestionItem[];

export interface MentionState {
	items?: SuggestionItems;
	query?: string;
}

export type OnFilteredItemsUpdateCallbackFn = (value: SuggestionItems) => void;

export type OnSelectCallbackFn = (item: SuggestionItem) => void;

export interface UpdateStateParams extends MentionState {}

export interface MentionConfigPortProps {
	readonly caretMenu: CaretMenuConfigPort;
	readonly filteredItems: SuggestionItems;

	updateState(params: UpdateStateParams): void;

	onSelect(callback: OnSelectCallbackFn): () => void;
}

export interface MentionConfigPort
	extends MentionConfigPortProps,
		UnwrapConfigPort {}

export interface MentionPublicPortProps {
	readonly caretMenu: CaretMenuPublicPort;
	readonly filteredItems: SuggestionItems;

	onFilteredItemsUpdate(callback: OnFilteredItemsUpdateCallbackFn): () => void;

	select(item: SuggestionItem): void;
}

export interface MentionPublicPort
	extends MentionPublicPortProps,
		UnwrapPublicPort {}

export interface MentionInternals {
	items: SuggestionItems;
	query: string;
	filteredItems: SuggestionItems;
}

export interface MentionAdapter {
	configPort: MentionConfigPort;
	publicPort: MentionPublicPort;
}

export interface MentionSettings {}

export interface CreateMentionAdapterParams
	extends CreateAdapterParams<MentionSettings> {}

export interface CreateMentionAdapterResult extends MentionAdapter {}
