import {
	createMarkdownAdapter,
	type MarkdownSettings,
} from "#adapters/Markdown";
import { configureMarkdown } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Markdown: AdapterFactoryFn<MarkdownSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createMarkdownAdapter(settings, options);

		editor.markdown = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureMarkdown({
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
