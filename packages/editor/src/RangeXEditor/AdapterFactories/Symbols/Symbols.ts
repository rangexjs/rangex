import { createSymbolsAdapter, type SymbolsSettings } from "#adapters/Symbols";
import { configureSymbols } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Symbols: AdapterFactoryFn<SymbolsSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createSymbolsAdapter(settings, options);

		const cleanup = configureSymbols({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.symbols = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
