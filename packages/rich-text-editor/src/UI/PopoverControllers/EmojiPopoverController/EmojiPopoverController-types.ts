export interface EmojiSuggestionItem {
	emoji: string;
	name: string;
}

export type EmojiItems = EmojiSuggestionItem[];

export type EmojiUpdateQueryFn = (value: string) => void;
export type EmojiUpdateFilteredItemsFn = (value: EmojiItems) => void;

export interface EmojiPopoverState {
	query?: string;
}

export interface UpdateEmojiPopoverStateParams extends EmojiPopoverState {}

export type EmojiListenerOption =
	| { type: "query"; callback: EmojiUpdateQueryFn }
	| { type: "filteredItems"; callback: EmojiUpdateFilteredItemsFn };

export type EmojiUpdateListenerParams = EmojiListenerOption & {
	operation: "add" | "delete";
};

export type EmojiOnSelectFn = (item: EmojiSuggestionItem) => void;

export interface EmojiPopover {
	popover: HTMLDivElement;
	filteredItems: EmojiItems;
	updateState(params: UpdateEmojiPopoverStateParams): void;
	onSelect(callback: EmojiOnSelectFn): () => void;
	findByName(name: string): EmojiSuggestionItem | undefined;
}
