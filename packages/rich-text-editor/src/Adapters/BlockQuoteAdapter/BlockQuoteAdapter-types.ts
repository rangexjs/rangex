export interface BlockQuoteToolbarButtonState {
	disabled: boolean;
}

export interface BlockQuoteState {
	toolbarButton?: BlockQuoteToolbarButtonState;
}

export interface UpdateBlockQuoteStateParams extends BlockQuoteState {}

export type BlockQuoteUpdateToolbarButtonFn = (
	value: BlockQuoteToolbarButtonState,
) => void;

export interface BlockQuoteUIPort {
	readonly toolbarButton: BlockQuoteToolbarButtonState;
	onToolbarButtonUpdate(callback: BlockQuoteUpdateToolbarButtonFn): () => void;
	emitInsertRequest(): void;
}

export type BlockQuoteOnInsertRequestFn = () => void;

export interface BlockQuoteEditorPort {
	updateState(params: UpdateBlockQuoteStateParams): void;
	onInsertRequest(callback: BlockQuoteOnInsertRequestFn): () => void;
}
