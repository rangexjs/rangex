export type OnOpenSelectionMenuCallbackFn = () => void;
export type OnCloseSelectionMenuCallbackFn = () => void;

export interface SelectionMenuConfigPort {
	readonly selectionMenu: HTMLDivElement;

	emitSelectionMenuToggle(): void;

	onOpenSelectionMenu(callback: OnOpenSelectionMenuCallbackFn): () => void;
	onCloseSelectionMenu(callback: OnCloseSelectionMenuCallbackFn): () => void;
}

export type OnSelectionMenuToggleCallbackFn = () => void;

export interface SelectionMenuPublicPort {
	readonly selectionMenu: HTMLDivElement;
	readonly selectionMenuOpen: boolean;

	onSelectionMenuOpenUpdate(
		callback: OnSelectionMenuToggleCallbackFn,
	): () => void;

	openSelectionMenu(): void;
	closeSelectionMenu(): void;
}

export interface SelectionMenuPort {
	configPort: SelectionMenuConfigPort;
	publicPort: SelectionMenuPublicPort;
}

export interface CreateSelectionMenuPortParams {
	floatingContainer: HTMLDivElement;
}

export interface CreateSelectionMenuPortResult extends SelectionMenuPort {}
