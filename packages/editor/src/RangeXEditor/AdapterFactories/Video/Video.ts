import { createVideoAdapter, type VideoSettings } from "#adapters/Video";
import { configureVideo } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Video: AdapterFactoryFn<VideoSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createVideoAdapter(settings, options);

		const cleanup = configureVideo({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.video = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
