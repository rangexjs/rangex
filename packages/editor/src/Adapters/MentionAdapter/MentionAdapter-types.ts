import type {
	CaretMenuConfigPort,
	CaretMenuPublicPort,
	CreateAdapterParams,
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

export interface UpdateStateParams extends MentionState {}

export type OnSelectCallbackFn = (item: SuggestionItem) => void;

export interface MentionConfigPortProps {
	readonly filteredItems: SuggestionItems;

	updateState(params: UpdateStateParams): void;

	onSelect(callback: OnSelectCallbackFn): () => void;
}

export interface MentionConfigPort
	extends MentionConfigPortProps,
		CaretMenuConfigPort {}

export type OnFilteredItemsUpdateCallbackFn = (value: SuggestionItems) => void;

export interface MentionPublicPortProps {
	readonly filteredItems: SuggestionItems;

	onFilteredItemsUpdate(callback: OnFilteredItemsUpdateCallbackFn): () => void;

	select(item: SuggestionItem): void;
}

export interface MentionPublicPort
	extends MentionPublicPortProps,
		CaretMenuPublicPort {}

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
