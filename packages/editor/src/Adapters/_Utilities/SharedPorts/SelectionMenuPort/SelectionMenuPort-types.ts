export type OnOpenSelectionMenuCallbackFn = () => void;
export type OnCloseSelectionMenuCallbackFn = () => void;
export type OnAddExemptNodeCallbackFn = (node: HTMLElement) => void;
export type OnRemoveExemptNodeCallbackFn = (node: HTMLElement) => void;

export interface SelectionMenuConfigPort {
	readonly selectionMenu: HTMLDivElement;

	emitSelectionMenuToggle(): void;

	onOpenSelectionMenu(callback: OnOpenSelectionMenuCallbackFn): () => void;
	onCloseSelectionMenu(callback: OnCloseSelectionMenuCallbackFn): () => void;
	onAddExemptNode(callback: OnAddExemptNodeCallbackFn): () => void;
	onRemoveExemptNode(callback: OnRemoveExemptNodeCallbackFn): () => void;
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
	addExemptNode(node: HTMLElement): void;
	removeExemptNode(node: HTMLElement): void;
}

export interface SelectionMenuPort {
	configPort: SelectionMenuConfigPort;
	publicPort: SelectionMenuPublicPort;
}

export interface CreateSelectionMenuPortParams {
	floatingContainer: HTMLDivElement;
}

export interface CreateSelectionMenuPortResult extends SelectionMenuPort {}
