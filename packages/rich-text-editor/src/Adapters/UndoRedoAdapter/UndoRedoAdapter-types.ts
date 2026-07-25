export interface UndoRedoToolbarButtonState {
	disabled: boolean;
}

export interface UndoRedoState {
	historyBackToolbarButton?: UndoRedoToolbarButtonState;
	historyForwardToolbarButton?: UndoRedoToolbarButtonState;
}

export interface UpdateUndoRedoStateParams extends UndoRedoState {}

export type UndoRedoNavigationType = "history-back" | "history-forward";

export interface UndoRedoNavigateParams {
	type: UndoRedoNavigationType;
}

export type UndoRedoUpdateHistoryBackToolbarButtonFn = (
	value: UndoRedoToolbarButtonState,
) => void;
export type UndoRedoUpdateHistoryForwardToolbarButtonFn = (
	value: UndoRedoToolbarButtonState,
) => void;

export interface UndoRedoUIPort {
	readonly historyBackToolbarButton: UndoRedoToolbarButtonState;
	readonly historyForwardToolbarButton: UndoRedoToolbarButtonState;
	onHistoryBackToolbarButtonUpdate(
		callback: UndoRedoUpdateHistoryBackToolbarButtonFn,
	): () => void;
	onHistoryForwardToolbarButtonUpdate(
		callback: UndoRedoUpdateHistoryForwardToolbarButtonFn,
	): () => void;
	emitNavigate(params: UndoRedoNavigateParams): void;
}

export type UndoRedoOnNavigateFn = (params: UndoRedoNavigateParams) => void;

export interface UndoRedoEditorPort {
	updateState(params: UpdateUndoRedoStateParams): void;
	onNavigate(callback: UndoRedoOnNavigateFn): () => void;
}
