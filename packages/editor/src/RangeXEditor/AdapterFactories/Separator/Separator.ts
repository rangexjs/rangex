import {
	createSeparatorAdapter,
	type SeparatorSettings,
} from "#adapters/Separator";
import { configureSeparator } from "#engine-links";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Separator: AdapterFactoryFn<SeparatorSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createSeparatorAdapter(settings, options);

		const cleanup = configureSeparator({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.separator = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
