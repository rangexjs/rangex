import { createSeparatorAdapter, type SeparatorSettings } from "#adapters/Separator";
import { configureSeparator } from "#features";

import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Separator: AdapterFactoryFn<SeparatorSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createSeparatorAdapter(settings, options);

		editor.separator = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureSeparator({
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
