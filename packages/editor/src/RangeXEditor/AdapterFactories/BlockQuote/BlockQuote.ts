import {
	type BlockQuoteSettings,
	createBlockQuoteAdapter,
} from "#adapters/BlockQuote";
import { configureBlockQuote } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const BlockQuote: AdapterFactoryFn<BlockQuoteSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createBlockQuoteAdapter(settings, options);

		editor.blockQuote = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureBlockQuote({
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
