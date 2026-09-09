import { createEmojiAdapter, type EmojiSettings } from "#adapters/Emoji";
import { configureEmoji } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Emoji: AdapterFactoryFn<EmojiSettings> = (settings) => {
	return (options, { editorAPI, editor }) => {
		const adapter = createEmojiAdapter(settings, options);

		const cleanup = configureEmoji({
			configPort: adapter.configPort,
			editorAPI,
		});

		editor.emoji = adapter.publicPort;

		return () => {
			cleanup();
		};
	};
};
