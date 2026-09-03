import { createImageAdapter, type ImageSettings } from "#adapters/Image";
import { configureImage } from "#engine-links";
import type { AdapterFactory } from "../../RangeXEditor-types";

export const Image: AdapterFactory<ImageSettings> = (settings) => {
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
