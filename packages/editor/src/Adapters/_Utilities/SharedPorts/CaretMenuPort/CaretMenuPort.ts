import type {
	CaretMenuConfigPort,
	CaretMenuInternals,
	CaretMenuPublicPort,
	CreateCaretMenuPortParams,
	CreateCaretMenuPortResult,
	OnToggleCallbackFn,
	UpdateStateParams,
} from "./CaretMenuPort-types";

export const createCaretMenuPort = ({
	floatingContainer,
}: CreateCaretMenuPortParams): CreateCaretMenuPortResult => {
	const element = document.createElement("div");
	floatingContainer.append(element);

	const internals: CaretMenuInternals = {
		isOpen: false,
	};

	// CommandListeners
	const onToggleListeners: Set<OnToggleCallbackFn> = new Set();

	const updateState = ({ isOpen }: UpdateStateParams) => {
		if (isOpen !== undefined) {
			internals.isOpen = isOpen;

			for (const listener of onToggleListeners) {
				listener();
			}
		}
	};

	const configPort: CaretMenuConfigPort = {
		get element() {
			return element;
		},

		updateCaretMenu(params) {
			updateState(params);
		},
	};

	const publicPort: CaretMenuPublicPort = {
		get element() {
			return element;
		},

		get isOpen() {
			return internals.isOpen;
		},

		onToggle(callback) {
			onToggleListeners.add(callback);
			return () => onToggleListeners.delete(callback);
		},
	};

	return { configPort, publicPort };
};
