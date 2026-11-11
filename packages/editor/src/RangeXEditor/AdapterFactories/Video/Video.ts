import { createVideoAdapter, type VideoSettings } from "#adapters/Video";
import { configureVideo } from "#features";

import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Video: AdapterFactoryFn<VideoSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createVideoAdapter(settings, options);

		editor.video = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureVideo({
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
