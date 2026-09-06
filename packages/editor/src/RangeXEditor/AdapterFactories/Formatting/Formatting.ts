import {
	createFormattingAdapter,
	type FormattingSettings,
} from "#adapters/Formatting";
import { configureFormatting } from "#engine-links";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Formatting: AdapterFactoryFn<FormattingSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createFormattingAdapter(settings, options);

		const cleanup = configureFormatting({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.formatting = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
