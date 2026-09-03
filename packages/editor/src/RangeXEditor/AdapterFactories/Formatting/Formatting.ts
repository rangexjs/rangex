import {
	createFormattingAdapter,
	type FormattingSettings,
} from "#adapters/Formatting";
import { configureFormatting } from "#engine-links";
import type { AdapterFactory } from "../../RangeXEditor-types";

export const Formatting: AdapterFactory<FormattingSettings> = (settings) => {
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
