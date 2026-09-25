import {
	createMarkdownAdapter,
	type MarkdownSettings,
} from "#adapters/Markdown";
import { configureMarkdown } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Markdown: AdapterFactoryFn<MarkdownSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createMarkdownAdapter(settings, options);

		const cleanup = configureMarkdown({
			adapterBus: options.adapterBus,
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.markdown = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
