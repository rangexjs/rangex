import { createSymbolsAdapter, type SymbolsSettings } from "#adapters/Symbols";
import { configureSymbols } from "#features";

import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Symbols: AdapterFactoryFn<SymbolsSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createSymbolsAdapter(settings, options);

		editor.symbols = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureSymbols({
					adapterBus: options.adapterBus,
					configPort: adapter.configPort,
					editorAPI,
				});

				return () => {
					cleanup();
				};
			},
		};
	};
};
