import { EmojiAdapter } from "#adapters";
import { configureEmoji } from "#editor-extensions";
import { createExtension } from "../_Utilities";

export const Emoji = createExtension<typeof EmojiAdapter>({
	createAdapter: (settings, options) => new EmojiAdapter(settings, options),
	configure: ({ adapter, editorAPI }) =>
		configureEmoji({ editorPort: adapter.editorPort, editorAPI }),
	components: {},
});
