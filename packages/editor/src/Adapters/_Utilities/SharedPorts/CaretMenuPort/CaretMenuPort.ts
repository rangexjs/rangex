import { createEmitter } from "../../CreateEmitter";
import type {
	CaretMenuConfigPort,
	CaretMenuInternals,
	CaretMenuPublicPort,
	CreateCaretMenuPortParams,
	CreateCaretMenuPortResult,
	OnQueryUpdateCallbackFn,
	UpdateStateParams,
} from "./CaretMenuPort-types";

export const createCaretMenuPort = ({
	floatingContainer,
}: CreateCaretMenuPortParams): CreateCaretMenuPortResult => {
	const element = document.createElement("div");
	floatingContainer.append(element);

	const internals: CaretMenuInternals = {
		// States
		query: null,
	};

	// StateListeners
	const queryUpdateEmitter = createEmitter<OnQueryUpdateCallbackFn>();

	const updateState = ({ query }: UpdateStateParams) => {
		if (query !== undefined && query !== internals.query) {
			internals.query = query;

			queryUpdateEmitter.emit(internals.query);
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

		get query() {
			return internals.query;
		},

		onQueryUpdate(callback) {
			return queryUpdateEmitter.subscribe(callback);
		},
	};

	return { configPort, publicPort };
};
