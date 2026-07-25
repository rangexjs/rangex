import type { CreateAdapterConstructor } from "#ports";

export type ListAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export type ListInsertionType = "ordered-list" | "unordered-list";

export interface ListToolbarButtonState {
	disabled: boolean;
}

export interface ListState {
	orderedListToolbarButton?: ListToolbarButtonState;
	unorderedListToolbarButton?: ListToolbarButtonState;
}

export interface UpdateListStateParams extends ListState {}

export interface ListInsertRequestParams {
	type: ListInsertionType;
}

export type ListUpdateOrderedListToolbarButtonFn = (
	value: ListToolbarButtonState,
) => void;
export type ListUpdateUnorderedListToolbarButtonFn = (
	value: ListToolbarButtonState,
) => void;

export interface ListUIPort {
	readonly orderedListToolbarButton: ListToolbarButtonState;
	readonly unorderedListToolbarButton: ListToolbarButtonState;
	onOrderedListToolbarButtonUpdate(
		callback: ListUpdateOrderedListToolbarButtonFn,
	): () => void;
	onUnorderedListToolbarButtonUpdate(
		callback: ListUpdateUnorderedListToolbarButtonFn,
	): () => void;
	emitInsertRequest(params: ListInsertRequestParams): void;
}

export type ListOnInsertRequestFn = (params: ListInsertRequestParams) => void;

export interface ListEditorPort {
	updateState(params: UpdateListStateParams): void;
	onInsertRequest(callback: ListOnInsertRequestFn): () => void;
}
