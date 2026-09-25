import { createEmojiAdapter, type EmojiSettings } from "#adapters/Emoji";
import { configureEmoji } from "#features";
import type { AdapterFactoryFn } from "../../RangeXEditor-types";

export const Emoji: AdapterFactoryFn<EmojiSettings> = (settings) => {
	return (options, { editor }) => {
		const adapter = createEmojiAdapter(settings, options);

		editor.emoji = adapter.publicPort;

		return {
			configure({ editorAPI }) {
				const cleanup = configureEmoji({
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
