export interface EmojiSuggestionItem {
	emoji: string;
	name: string;
}

export type EmojiItems = EmojiSuggestionItem[];

export interface EmojiPopoverState {
	query?: string;
}

export interface UpdateEmojiPopoverStateParams extends EmojiPopoverState {}

export type EmojiOnSelectFn = (item: EmojiSuggestionItem) => void;

export interface EmojiPort {
	popover: HTMLDivElement;
	filteredItems: EmojiItems;
	updateState(params: UpdateEmojiPopoverStateParams): void;
	onSelect(callback: EmojiOnSelectFn): () => void;
	findByName(name: string): EmojiSuggestionItem | undefined;
}
