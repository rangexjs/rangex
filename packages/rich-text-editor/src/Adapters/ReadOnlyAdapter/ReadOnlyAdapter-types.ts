import type { CreateAdapterConstructor } from "#ports";

export type ReadOnlyAdapterConstructorParams = CreateAdapterConstructor<{
	[index: string]: never;
}>;

export interface ReadOnlyToolbarButtonState {
	checked: boolean;
}

export interface ReadOnlyState {
	toolbarButton?: ReadOnlyToolbarButtonState;
}

export interface UpdateReadOnlyStateParams extends ReadOnlyState {}

export interface ReadOnlyEmitToggleParams {
	newState: boolean;
}

export type ReadOnlyUpdateToolbarButtonFn = (
	value: ReadOnlyToolbarButtonState,
) => void;

export interface ReadOnlyUIPort {
	readonly toolbarButton: ReadOnlyToolbarButtonState;
	onToolbarButtonUpdate(callback: ReadOnlyUpdateToolbarButtonFn): () => void;
	emitToggle(params: ReadOnlyEmitToggleParams): void;
}

export type ReadOnlyOnToggleFn = (params: ReadOnlyEmitToggleParams) => void;

export interface ReadOnlyEditorPort {
	updateState(params: UpdateReadOnlyStateParams): void;
	onToggle(callback: ReadOnlyOnToggleFn): () => void;
}
