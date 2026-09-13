import { extendObjectProperties } from "#utilities";
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
	const [{ items = defaultSymbolsItems }, _options] = params;

	// CommandListeners
	const onInsertListeners: Set<OnInsertCallbackFn> = new Set();

	const configPort: SymbolsConfigPort = extendObjectProperties({}, {
		onInsert(callback) {
			onInsertListeners.add(callback);
			return () => onInsertListeners.delete(callback);
		},
	} satisfies SymbolsConfigPortProps);

	const publicPort: SymbolsPublicPort = extendObjectProperties({}, {
		get items() {
			return items;
		},

		insert(data) {
			for (const listener of onInsertListeners) {
				listener(data);
			}
		},
	} satisfies SymbolsPublicPortProps);

	return { configPort, publicPort };
};
