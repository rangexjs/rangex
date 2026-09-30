import { extendObjectProperties } from "#utilities";
import { createEmitter } from "../_Utilities";
import { defaultSymbolsItems } from "./SymbolsAdapter-default";
import type {
	CreateSymbolsAdapterParams,
	CreateSymbolsAdapterResult,
	OnInsertCallbackFn,
	SymbolsConfigPort,
	SymbolsConfigPortProps,
	SymbolsPublicPort,
	SymbolsPublicPortProps,
} from "./SymbolsAdapter-types";

export const createSymbolsAdapter = (
	...params: CreateSymbolsAdapterParams
): CreateSymbolsAdapterResult => {
	const [{ items = defaultSymbolsItems }, { adapterBus }] = params;

	adapterBus.registerAdapter("symbols");

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();

	const configPort: SymbolsConfigPort = extendObjectProperties({}, {
		onInsert(callback) {
			return insertEmitter.subscribe(callback);
		},
	} satisfies SymbolsConfigPortProps);

	const publicPort: SymbolsPublicPort = extendObjectProperties({}, {
		get items() {
			return items;
		},

		insert(data) {
			insertEmitter.emit(data);
		},
	} satisfies SymbolsPublicPortProps);

	return { configPort, publicPort };
};
