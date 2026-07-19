export interface MentionAdapterConstructorParams {
	[index: string]: never;
}

export type MentionOnSelectFn = (params: MentionSelectParams) => void;

export interface MentionSelectParams {
	id: string;
	name: string;
}

export interface MentionSuggestionItem {
	id: string;
	img: string;
	name: string;
	username: string;
}

export type MentionItems = MentionSuggestionItem[];

export interface MentionPopoverState {
	items?: MentionItems;
	query?: string;
}

export interface UpdateMentionPopoverStateParams extends MentionPopoverState {}

export interface MentionEditorPort {
	popover: HTMLDivElement;
	filteredItems: MentionItems;
	updateState(params: MentionPopoverState): void;
	onSelect(callback: MentionOnSelectFn): () => void;
}

export type MentionUpdateItemsFn = (value: MentionItems) => void;
export type MentionUpdateQueryFn = (value: string) => void;
export type MentionUpdateFilteredItemsFn = (value: MentionItems) => void;

export type MentionListenerOption =
	| { type: "items"; callback: MentionUpdateItemsFn }
	| { type: "query"; callback: MentionUpdateQueryFn }
	| { type: "filteredItems"; callback: MentionUpdateFilteredItemsFn };

export type MentionUpdateListenerParams = MentionListenerOption & {
	operation: "add" | "delete";
};

export interface MentionUIPort {
	readonly filteredItems: MentionItems;
	subscribe(params: MentionListenerOption): void;
	unsubscribe(params: MentionListenerOption): void;
	setPopover(element: HTMLDivElement): void;
	emitSelect(item: MentionSuggestionItem): void;
}
