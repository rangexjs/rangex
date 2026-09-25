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

export type OnSelectCallbackFn = (item: SuggestionItem) => void;

export interface EmojiConfigPortProps {
	readonly caretMenu: CaretMenuConfigPort;

	onSelect(callback: OnSelectCallbackFn): () => void;

	findByName(name: string): SuggestionItem | undefined;
}

export interface EmojiConfigPort extends EmojiConfigPortProps {}

export interface EmojiPublicPortProps {
	readonly caretMenu: CaretMenuPublicPort;
	readonly items: SuggestionItems;

	select(item: SuggestionItem): void;
}

export interface EmojiPublicPort extends EmojiPublicPortProps {}

export interface EmojiInternals {
	items: SuggestionItems;
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
