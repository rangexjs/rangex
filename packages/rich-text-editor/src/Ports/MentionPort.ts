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

export interface MentionPort {
	popover: HTMLDivElement;
	filteredItems: MentionItems;
	updateState(params: UpdateMentionPopoverStateParams): void;
	onSelect(callback: MentionOnSelectFn): () => void;
}
