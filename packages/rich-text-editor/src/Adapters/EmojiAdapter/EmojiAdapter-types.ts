import type { CreateAdapterConstructor } from "#ports";
import type { EditorOverlayMount, UIOverlayMount } from "../_Utilities";

export interface EmojiSuggestionItem {
	emoji: string;
	name: string;
}

export type EmojiItems = EmojiSuggestionItem[];

export interface EmojiSettings {
	items?: EmojiItems;
}

export type EmojiAdapterConstructorParams =
	CreateAdapterConstructor<EmojiSettings>;

export interface EmojiState {
	query?: string;
	isOpen?: boolean;
}

export interface UpdateEmojiStateParams extends EmojiState {}

export type EmojiUpdateFilteredItemsFn = (value: EmojiItems) => void;
export type EmojiUpdateIsOpenFn = (value: boolean) => void;

export interface EmojiUIPort {
	readonly anchoredOverlay: UIOverlayMount;
	readonly filteredItems: EmojiItems;
	onFilteredItemsUpdate(callback: EmojiUpdateFilteredItemsFn): () => void;
	readonly isOpen: boolean;
	onIsOpenUpdate(callback: EmojiUpdateIsOpenFn): () => void;
	emitSelect(item: EmojiSuggestionItem): void;
}

export type EmojiOnSelectFn = (item: EmojiSuggestionItem) => void;

export interface EmojiEditorPort {
	readonly anchoredOverlay: EditorOverlayMount;
	readonly filteredItems: EmojiItems;
	updateState(params: UpdateEmojiStateParams): void;
	onSelect(callback: EmojiOnSelectFn): () => void;
	findByName(name: string): EmojiSuggestionItem | undefined;
}
