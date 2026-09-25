import { type AudioSettings, createAudioAdapter } from "#adapters/Audio";
import { configureAudio } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Audio: AdapterFactoryFn<AudioSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createAudioAdapter(settings, options);

		const cleanup = configureAudio({
			adapterBus: options.adapterBus,
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.audio = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
