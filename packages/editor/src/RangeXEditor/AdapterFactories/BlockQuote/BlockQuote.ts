import {
	type BlockQuoteSettings,
	createBlockQuoteAdapter,
} from "#adapters/BlockQuote";
import { configureBlockQuote } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const BlockQuote: AdapterFactoryFn<BlockQuoteSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createBlockQuoteAdapter(settings, options);

		const cleanup = configureBlockQuote({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.blockQuote = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
