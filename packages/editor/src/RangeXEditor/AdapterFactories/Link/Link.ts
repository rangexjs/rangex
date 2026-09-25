import { createLinkAdapter, type LinkSettings } from "#adapters/Link";
import { configureLink } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Link: AdapterFactoryFn<LinkSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createLinkAdapter(settings, options);

		const cleanup = configureLink({
			adapterBus: options.adapterBus,
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.link = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
