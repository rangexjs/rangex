export type CaretMenuQuery = string | null;

export interface CaretMenuState {
	query: CaretMenuQuery;
}

export type OnQueryUpdateCallbackFn = (value: CaretMenuQuery) => void;

export interface UpdateStateParams extends Partial<CaretMenuState> {}

export interface CaretMenuInternals {
	query: CaretMenuQuery;
}

export interface CaretMenuConfigPort {
	readonly element: HTMLDivElement;

	updateCaretMenu(params: UpdateStateParams): void;
}

export interface CaretMenuPublicPort {
	readonly element: HTMLDivElement;
	readonly query: CaretMenuQuery;

	onQueryUpdate(callback: OnQueryUpdateCallbackFn): () => void;
}

export interface CaretMenuPort {
	configPort: CaretMenuConfigPort;
	publicPort: CaretMenuPublicPort;
}

export interface CreateCaretMenuPortParams {
	floatingContainer: HTMLDivElement;
}

export interface CreateCaretMenuPortResult extends CaretMenuPort {}
