import { createFindReplaceAdapter, type FindReplaceSettings } from "#adapters/FindReplace";
import { configureFindReplace } from "#features";

import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const FindReplace: AdapterFactoryFn<FindReplaceSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createFindReplaceAdapter(settings, options);

		editor.findReplace = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureFindReplace({
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
