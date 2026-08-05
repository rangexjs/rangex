import type { CreateAdapterConstructor } from "#ports";
import type { EditorOverlayMount, UIOverlayMount } from "../_Utilities";

export type MentionAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

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
	isOpen?: boolean;
}

export interface UpdateMentionStateParams extends MentionState {}

export type MentionUpdateItemsFn = (value: MentionItems) => void;
export type MentionUpdateQueryFn = (value: string) => void;
export type MentionUpdateFilteredItemsFn = (value: MentionItems) => void;
export type MentionUpdateIsOpenFn = (value: boolean) => void;

export interface MentionUIPort {
	readonly anchoredOverlay: UIOverlayMount;
	readonly filteredItems: MentionItems;
	onFilteredItemsUpdate(callback: MentionUpdateFilteredItemsFn): () => void;
	readonly isOpen: boolean;
	onIsOpenUpdate(callback: MentionUpdateIsOpenFn): () => void;
	emitSelect(item: MentionSuggestionItem): void;
}

export interface MentionSelectParams {
	id: string;
	name: string;
}

export type MentionOnSelectFn = (params: MentionSelectParams) => void;

export interface MentionEditorPort {
	readonly anchoredOverlay: EditorOverlayMount;
	readonly filteredItems: MentionItems;
	updateState(params: MentionState): void;
	onSelect(callback: MentionOnSelectFn): () => void;
}
