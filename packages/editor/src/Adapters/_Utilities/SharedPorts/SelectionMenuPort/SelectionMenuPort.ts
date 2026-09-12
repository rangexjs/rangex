import type {
	CreateSelectionMenuPortParams,
	CreateSelectionMenuPortResult,
	OnCloseSelectionMenuCallbackFn,
	OnOpenSelectionMenuCallbackFn,
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
	};

	return { configPort, publicPort };
};
