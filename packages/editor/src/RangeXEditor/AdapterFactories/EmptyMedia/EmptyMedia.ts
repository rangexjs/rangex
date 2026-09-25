import {
	createEmptyMediaAdapter,
	type EmptyMediaSettings,
} from "#adapters/EmptyMedia";
import { configureEmptyMedia } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const EmptyMedia: AdapterFactoryFn<EmptyMediaSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createEmptyMediaAdapter(settings, options);

		const cleanup = configureEmptyMedia({
			adapterBus: options.adapterBus,
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.emptyMedia = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
