export interface CaretMenuState {
	open: boolean;
}

export interface UpdateStateParams {
	open?: boolean;
}

export interface CaretMenuInternals {
	caretMenuOpen: boolean;
}

export interface CaretMenuConfigPort {
	readonly caretMenuEl: HTMLDivElement;

	setCaretMenu(caretMenu: CaretMenuState): void;
}

export type OnCaretMenuOpenUpdateCallbackFn = (caretMenuOpen: boolean) => void;

export interface CaretMenuPublicPort {
	readonly caretMenuEl: HTMLDivElement;

	readonly caretMenuOpen: boolean;

	onCaretMenuOpenUpdate(callback: OnCaretMenuOpenUpdateCallbackFn): () => void;
}

export interface CaretMenuPort {
	configPort: CaretMenuConfigPort;
	publicPort: CaretMenuPublicPort;
}

export interface CreateCaretMenuPortParams {
	floatingContainer: HTMLDivElement;
}

export interface CreateCaretMenuPortResult extends CaretMenuPort {}
