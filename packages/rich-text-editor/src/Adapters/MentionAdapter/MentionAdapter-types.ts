export interface MentionAdapterConstructorParams {
	[index: string]: never;
}

export interface MentionSuggestionItem {
	id: string;
	img: string;
	name: string;
	username: string;
}

export type MentionItems = MentionSuggestionItem[];

export interface MentionState {
	items?: MentionItems;
	query?: string;
}

export interface UpdateMentionStateParams extends MentionState {}

export type MentionUpdateItemsFn = (value: MentionItems) => void;
export type MentionUpdateQueryFn = (value: string) => void;
export type MentionUpdateFilteredItemsFn = (value: MentionItems) => void;

export interface MentionUIPort {
	readonly filteredItems: MentionItems;
	onFilteredItemsUpdate(callback: MentionUpdateFilteredItemsFn): () => void;
	setPopover(element: HTMLDivElement): void;
	emitSelect(item: MentionSuggestionItem): void;
}

export interface MentionSelectParams {
	id: string;
	name: string;
}

export type MentionOnSelectFn = (params: MentionSelectParams) => void;

export interface MentionEditorPort {
	popover: HTMLDivElement;
	filteredItems: MentionItems;
	updateState(params: MentionState): void;
	onSelect(callback: MentionOnSelectFn): () => void;
}
