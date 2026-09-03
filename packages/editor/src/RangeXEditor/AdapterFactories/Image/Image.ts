import { createImageAdapter, type Settings } from "#adapters/Image";
import { configureImage } from "#engine-links";
import type { AdapterFactory } from "../../RangeXEditor-types";

export const Image: AdapterFactory<Settings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createImageAdapter(settings, options);

		const cleanup = configureImage({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.image = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
