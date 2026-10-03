import { createStateEmitter } from "../../CreateStateEmitter";
import type {
	CaretMenuConfigPort,
	CaretMenuPublicPort,
	CaretMenuQuery,
	CreateCaretMenuPortParams,
	CreateCaretMenuPortResult,
	UpdateStateParams,
} from "./CaretMenuPort-types";

export const createCaretMenuPort = ({
	floatingContainer,
}: CreateCaretMenuPortParams): CreateCaretMenuPortResult => {
	const element = document.createElement("div");
	floatingContainer.append(element);

	// States
	const queryState = createStateEmitter<CaretMenuQuery>(null);

	const updateState = ({ query }: UpdateStateParams) => {
		if (query !== undefined) {
			queryState.set(query);
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
			return queryState.get();
		},

		onQueryUpdate(callback) {
			return queryState.subscribe(callback);
		},
	};

	return { configPort, publicPort };
};
