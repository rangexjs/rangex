import {
	createFormattingAdapter,
	type FormattingSettings,
} from "#adapters/Formatting";
import { configureFormatting } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Formatting: AdapterFactoryFn<FormattingSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createFormattingAdapter(settings, options);

		editor.formatting = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureFormatting({
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
