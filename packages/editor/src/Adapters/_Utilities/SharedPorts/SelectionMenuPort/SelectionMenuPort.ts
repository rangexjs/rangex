import type {
	CreateSelectionMenuPortParams,
	CreateSelectionMenuPortResult,
	OnAddExemptNodeCallbackFn,
	OnCloseSelectionMenuCallbackFn,
	OnOpenSelectionMenuCallbackFn,
	OnRemoveExemptNodeCallbackFn,
	OnSelectionMenuToggleCallbackFn,
	SelectionMenuConfigPort,
	SelectionMenuPublicPort,
} from "./SelectionMenuPort-types";

export const createSelectionMenuPort = ({
	floatingContainer,
}: CreateSelectionMenuPortParams): CreateSelectionMenuPortResult => {
	const selectionMenu = document.createElement("div");
	floatingContainer.append(selectionMenu);

	// ConfigPort
	const onOpenSelectionMenuListeners: Set<OnOpenSelectionMenuCallbackFn> =
		new Set();
	const onCloseSelectionMenuListeners: Set<OnCloseSelectionMenuCallbackFn> =
		new Set();
	const onAddExemptNodeListeners: Set<OnAddExemptNodeCallbackFn> = new Set();
	const onRemoveExemptNodeListeners: Set<OnRemoveExemptNodeCallbackFn> =
		new Set();

	// PublicPort
	const onSelectionMenuToggleListeners: Set<OnSelectionMenuToggleCallbackFn> =
		new Set();

	const emitListener = <P extends unknown[]>(
		listeners: Set<(...params: P) => void>,
	) => {
		return (...params: P) => {
			for (const listener of listeners) {
				listener(...params);
			}
		};
	};

	const emitOpenSelectionMenu = emitListener(onOpenSelectionMenuListeners);
	const emitCloseSelectionMenu = emitListener(onCloseSelectionMenuListeners);
	const emitSelectionMenuToggle = emitListener(onSelectionMenuToggleListeners);
	const emitAddExemptNode = emitListener(onAddExemptNodeListeners);
	const emitRemoveExemptNode = emitListener(onRemoveExemptNodeListeners);

	const configPort: SelectionMenuConfigPort = {
		get selectionMenu() {
			return selectionMenu;
		},

		emitSelectionMenuToggle() {
			emitSelectionMenuToggle();
		},

		onOpenSelectionMenu(callback) {
			onOpenSelectionMenuListeners.add(callback);
			return () => onOpenSelectionMenuListeners.delete(callback);
		},

		onCloseSelectionMenu(callback) {
			onCloseSelectionMenuListeners.add(callback);
			return () => onCloseSelectionMenuListeners.delete(callback);
		},

		onAddExemptNode(callback) {
			onAddExemptNodeListeners.add(callback);
			return () => onAddExemptNodeListeners.delete(callback);
		},

		onRemoveExemptNode(callback) {
			onRemoveExemptNodeListeners.add(callback);
			return () => onRemoveExemptNodeListeners.delete(callback);
		},
	};

	const publicPort: SelectionMenuPublicPort = {
		get selectionMenu() {
			return selectionMenu;
		},

		get selectionMenuOpen() {
			return selectionMenu.matches(":popover-open");
		},

		onSelectionMenuOpenUpdate(callback) {
			onSelectionMenuToggleListeners.add(callback);
			return () => onSelectionMenuToggleListeners.delete(callback);
		},

		openSelectionMenu() {
			emitOpenSelectionMenu();
		},

		closeSelectionMenu() {
			emitCloseSelectionMenu();
		},

		addExemptNode(node) {
			emitAddExemptNode(node);
		},

		removeExemptNode(node) {
			emitRemoveExemptNode(node);
		},
	};

	return { configPort, publicPort };
};
