export interface MentionSuggestionItem {
	id: string;
	name: string;
	username: string;
	img: string;
}

export type MentionItems = MentionSuggestionItem[];

export type MentionUpdateItemsFn = (value: MentionItems) => void;
export type MentionUpdateQueryFn = (value: string) => void;
export type MentionUpdateFilteredItemsFn = (value: MentionItems) => void;

export interface MentionPopoverState {
	items?: MentionItems;
	query?: string;
}

export interface UpdateMentionPopoverStateParams extends MentionPopoverState {}

export type MentionListenerOption =
	| { type: "items"; callback: MentionUpdateItemsFn }
	| { type: "query"; callback: MentionUpdateQueryFn }
	| { type: "filteredItems"; callback: MentionUpdateFilteredItemsFn };

export type MentionUpdateListenerParams = MentionListenerOption & {
	operation: "add" | "delete";
};

export type MentionOnSelectFn = (item: MentionSuggestionItem) => void;

export interface MentionPopover {
	popover: HTMLDivElement;
	filteredItems: MentionItems;
	updateState(params: UpdateMentionPopoverStateParams): void;
	onSelect(callback: MentionOnSelectFn): () => void;
}
