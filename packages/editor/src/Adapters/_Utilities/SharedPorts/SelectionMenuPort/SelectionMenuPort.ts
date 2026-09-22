import { createEmitter } from "../../CreateEmitter";
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
	const toggleEmitter = createEmitter<OnSelectionMenuToggleCallbackFn>();
	const openEmitter = createEmitter<OnOpenCallbackFn>();
	const closeEmitter = createEmitter<OnCloseCallbackFn>();
	const addExemptNodeEmitter = createEmitter<OnAddExemptNodeCallbackFn>();
	const removeExemptNodeEmitter = createEmitter<OnRemoveExemptNodeCallbackFn>();

	const configPort: SelectionMenuConfigPort = {
		get element() {
			return element;
		},

		notifyToggle() {
			toggleEmitter.emit();
		},

		onOpen(callback) {
			return openEmitter.subscribe(callback);
		},

		onClose(callback) {
			return closeEmitter.subscribe(callback);
		},

		onAddExemptNode(callback) {
			return addExemptNodeEmitter.subscribe(callback);
		},

		onRemoveExemptNode(callback) {
			return removeExemptNodeEmitter.subscribe(callback);
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
			return toggleEmitter.subscribe(callback);
		},

		open() {
			openEmitter.emit();
		},

		close() {
			closeEmitter.emit();
		},

		addExemptNode(node) {
			addExemptNodeEmitter.emit(node);
		},

		removeExemptNode(node) {
			removeExemptNodeEmitter.emit(node);
		},
	};

	return { configPort, publicPort };
};
