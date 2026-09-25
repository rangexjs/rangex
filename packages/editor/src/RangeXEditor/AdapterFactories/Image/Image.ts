import { createImageAdapter, type ImageSettings } from "#adapters/Image";
import { configureImage } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Image: AdapterFactoryFn<ImageSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createImageAdapter(settings, options);

		const cleanup = configureImage({
			adapterBus: options.adapterBus,
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.image = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
