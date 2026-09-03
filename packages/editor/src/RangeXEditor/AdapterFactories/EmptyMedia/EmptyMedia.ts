import {
	createEmptyMediaAdapter,
	type EmptyMediaSettings,
} from "#adapters/EmptyMedia";
import { configureEmptyMedia } from "#engine-links";
import type { AdapterFactory } from "../../RangeXEditor-types";

export const EmptyMedia: AdapterFactory<EmptyMediaSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createEmptyMediaAdapter(settings, options);

		const cleanup = configureEmptyMedia({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.emptyMedia = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
