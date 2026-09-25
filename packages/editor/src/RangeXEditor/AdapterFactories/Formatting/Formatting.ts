import {
	createFormattingAdapter,
	type FormattingSettings,
} from "#adapters/Formatting";
import { configureFormatting } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Formatting: AdapterFactoryFn<FormattingSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createFormattingAdapter(settings, options);

		const cleanup = configureFormatting({
			adapterBus: options.adapterBus,
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.formatting = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
