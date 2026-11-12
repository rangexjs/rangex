import { createLineHandlerAdapter, type LineHandlerSettings } from "#adapters/LineHandler";
import { configureLineHandler } from "#features";

import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const LineHandler: AdapterFactoryFn<LineHandlerSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createLineHandlerAdapter(settings, options);

		editor.lineHandler = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureLineHandler({
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
