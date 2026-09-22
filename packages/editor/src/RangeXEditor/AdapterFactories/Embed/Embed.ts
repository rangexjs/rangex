import { createEmbedAdapter, type EmbedSettings } from "#adapters/Embed";
import { configureEmbed } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Embed: AdapterFactoryFn<EmbedSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createEmbedAdapter(settings, options);

		const cleanup = configureEmbed({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.embed = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
