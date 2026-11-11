import { createImageAdapter, type ImageSettings } from "#adapters/Image";
import { configureImage } from "#features";

import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Image: AdapterFactoryFn<ImageSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createImageAdapter(settings, options);

		editor.image = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureImage({
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
