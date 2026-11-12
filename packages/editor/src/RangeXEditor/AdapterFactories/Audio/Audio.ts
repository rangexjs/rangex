import { type AudioSettings, createAudioAdapter } from "#adapters/Audio";
import { configureAudio } from "#features";

import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Audio: AdapterFactoryFn<AudioSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createAudioAdapter(settings, options);

		editor.audio = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureAudio({
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
