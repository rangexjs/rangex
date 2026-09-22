export interface CaretMenuState {
	isOpen: boolean;
}

export interface UpdateStateParams {
	isOpen?: boolean;
}

export interface CaretMenuInternals {
	isOpen: boolean;
}

export interface CaretMenuConfigPort {
	readonly element: HTMLDivElement;

	updateCaretMenu(params: UpdateStateParams): void;
}

export type OnToggleCallbackFn = () => void;

export interface CaretMenuPublicPort {
	readonly element: HTMLDivElement;
	readonly isOpen: boolean;

	onToggle(callback: OnToggleCallbackFn): () => void;
}

export interface CaretMenuPort {
	configPort: CaretMenuConfigPort;
	publicPort: CaretMenuPublicPort;
}

export interface CreateCaretMenuPortParams {
	floatingContainer: HTMLDivElement;
}

export interface CreateCaretMenuPortResult extends CaretMenuPort {}
