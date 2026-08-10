import type { CreateAdapterConstructor } from "#ports";

export type SeparatorAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export interface SeparatorToolbarButtonState {
	disabled: boolean;
}

export interface SeparatorState {
	toolbarButton?: SeparatorToolbarButtonState;
}

export interface UpdateSeparatorStateParams extends SeparatorState {}

export type SeparatorUpdateToolbarButtonFn = (
	value: SeparatorToolbarButtonState,
) => void;

export interface SeparatorUIPort {
	readonly toolbarButton: SeparatorToolbarButtonState;
	onToolbarButtonUpdate(callback: SeparatorUpdateToolbarButtonFn): () => void;
	emitInsertRequest(): void;
}

export type SeparatorOnInsertRequestFn = () => void;

export interface SeparatorEditorPort {
	updateState(params: UpdateSeparatorStateParams): void;
	onInsertRequest(callback: SeparatorOnInsertRequestFn): () => void;
}
