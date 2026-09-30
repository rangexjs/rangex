import { createEmbedAdapter, type EmbedSettings } from "#adapters/Embed";
import { configureEmbed } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Embed: AdapterFactoryFn<EmbedSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createEmbedAdapter(settings, options);

		editor.embed = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureEmbed({
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
