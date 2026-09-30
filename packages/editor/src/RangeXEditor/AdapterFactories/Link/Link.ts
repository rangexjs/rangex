import { createLinkAdapter, type LinkSettings } from "#adapters/Link";
import { configureLink } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Link: AdapterFactoryFn<LinkSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createLinkAdapter(settings, options);

		editor.link = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureLink({
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
