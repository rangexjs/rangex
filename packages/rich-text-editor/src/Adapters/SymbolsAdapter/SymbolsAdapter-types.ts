import type { CreateAdapterConstructor } from "#ports";

export type SymbolsItems = string[];

export interface SymbolsSettings {
	items: SymbolsItems;
}

export type SymbolsAdapterConstructorParams =
	CreateAdapterConstructor<SymbolsSettings>;

export interface SymbolsToolbarButtonState {
	disabled: boolean;
}

export interface SymbolsState {
	toolbarButton?: SymbolsToolbarButtonState;
}

export interface UpdateSymbolsStateParams extends SymbolsState {}

export interface SymbolsInsertRequestParams {
	data: string;
}

export type SymbolsUpdateToolbarButtonFn = (
	value: SymbolsToolbarButtonState,
) => void;

export interface SymbolsUIPort {
	readonly items: SymbolsItems;
	readonly toolbarButton: SymbolsToolbarButtonState;
	onToolbarButtonUpdate(callback: SymbolsUpdateToolbarButtonFn): () => void;
	emitInsertRequest(params: SymbolsInsertRequestParams): void;
}

export type SymbolsOnInsertRequestFn = (
	params: SymbolsInsertRequestParams,
) => void;

export interface SymbolsEditorPort {
	updateState(params: UpdateSymbolsStateParams): void;
	onInsertRequest(callback: SymbolsOnInsertRequestFn): () => void;
}
