import type {
	CreateSelectionMenuPortParams,
	CreateSelectionMenuPortResult,
	OnAddExemptNodeCallbackFn,
	OnCloseCallbackFn,
	OnOpenCallbackFn,
	OnRemoveExemptNodeCallbackFn,
	OnSelectionMenuToggleCallbackFn,
	SelectionMenuConfigPort,
	SelectionMenuPublicPort,
} from "./SelectionMenuPort-types";

export const createSelectionMenuPort = ({
	floatingContainer,
}: CreateSelectionMenuPortParams): CreateSelectionMenuPortResult => {
	const element = document.createElement("div");
	floatingContainer.append(element);

	// CommandListeners
	const onToggleListeners: Set<OnSelectionMenuToggleCallbackFn> = new Set();
	const onOpenListeners: Set<OnOpenCallbackFn> = new Set();
	const onCloseListeners: Set<OnCloseCallbackFn> = new Set();
	const onAddExemptNodeListeners: Set<OnAddExemptNodeCallbackFn> = new Set();
	const onRemoveExemptNodeListeners: Set<OnRemoveExemptNodeCallbackFn> =
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

	const emitOpen = emitListener(onOpenListeners);
	const emitClose = emitListener(onCloseListeners);
	const emitToggle = emitListener(onToggleListeners);
	const emitAddExemptNode = emitListener(onAddExemptNodeListeners);
	const emitRemoveExemptNode = emitListener(onRemoveExemptNodeListeners);

	const configPort: SelectionMenuConfigPort = {
		get element() {
			return element;
		},

		notifyToggle() {
			emitToggle();
		},

		onOpen(callback) {
			onOpenListeners.add(callback);
			return () => onOpenListeners.delete(callback);
		},

		onClose(callback) {
			onCloseListeners.add(callback);
			return () => onCloseListeners.delete(callback);
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
		get element() {
			return element;
		},

		get isOpen() {
			return element.matches(":popover-open");
		},

		onToggle(callback) {
			onToggleListeners.add(callback);
			return () => onToggleListeners.delete(callback);
		},

		open() {
			emitOpen();
		},

		close() {
			emitClose();
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
