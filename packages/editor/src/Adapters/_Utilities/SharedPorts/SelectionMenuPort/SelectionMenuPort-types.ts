export type OnOpenCallbackFn = () => void;
export type OnCloseCallbackFn = () => void;
export type OnAddExemptNodeCallbackFn = (node: HTMLElement) => void;
export type OnRemoveExemptNodeCallbackFn = (node: HTMLElement) => void;

export interface SelectionMenuConfigPort {
	readonly element: HTMLDivElement;

	notifyToggle(): void;

	onOpen(callback: OnOpenCallbackFn): () => void;
	onClose(callback: OnCloseCallbackFn): () => void;
	onAddExemptNode(callback: OnAddExemptNodeCallbackFn): () => void;
	onRemoveExemptNode(callback: OnRemoveExemptNodeCallbackFn): () => void;
}

export type OnSelectionMenuToggleCallbackFn = () => void;

export interface SelectionMenuPublicPort {
	readonly element: HTMLDivElement;
	readonly isOpen: boolean;

	onToggle(callback: OnSelectionMenuToggleCallbackFn): () => void;

	open(): void;
	close(): void;
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
