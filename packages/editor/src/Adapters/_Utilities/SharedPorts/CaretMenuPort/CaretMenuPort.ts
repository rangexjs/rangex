import type {
	CaretMenuConfigPort,
	CaretMenuInternals,
	CaretMenuPublicPort,
	CreateCaretMenuPortParams,
	CreateCaretMenuPortResult,
	OnCaretMenuOpenUpdateCallbackFn,
	UpdateStateParams,
} from "./CaretMenuPort-types";

export const createCaretMenuPort = ({
	floatingContainer,
}: CreateCaretMenuPortParams): CreateCaretMenuPortResult => {
	const caretMenuEl = document.createElement("div");
	floatingContainer.append(caretMenuEl);

	const internals: CaretMenuInternals = {
		caretMenuOpen: false,
	};

	// StateListeners
	const onCaretMenuOpenUpdateListeners: Set<OnCaretMenuOpenUpdateCallbackFn> =
		new Set();

	const updateState = ({ open }: UpdateStateParams) => {
		if (open !== undefined) {
			internals.caretMenuOpen = open;

			for (const listener of onCaretMenuOpenUpdateListeners) {
				listener(internals.caretMenuOpen);
			}
		}
	};

	const configPort: CaretMenuConfigPort = {
		get caretMenuEl() {
			return caretMenuEl;
		},

		updateCaretMenu(params) {
			updateState(params);
		},
	};

	const publicPort: CaretMenuPublicPort = {
		get caretMenuEl() {
			return caretMenuEl;
		},

		get caretMenuOpen() {
			return internals.caretMenuOpen;
		},

		onCaretMenuOpenUpdate(callback) {
			onCaretMenuOpenUpdateListeners.add(callback);
			return () => onCaretMenuOpenUpdateListeners.delete(callback);
		},
	};

	return { configPort, publicPort };
};
