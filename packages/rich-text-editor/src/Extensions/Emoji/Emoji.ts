import { Emoji as EmojiFactory } from "@rangex/editor/emoji";
import { EmojiCaretMenu } from "#features";
import type { Extension } from "../_Utilities";

export const Emoji = (
	...adapterSettings: Parameters<typeof EmojiFactory>
): Extension => {
	return {
		createAdapter: () => EmojiFactory(...adapterSettings),
		components: {
			toolbarButtons: {},
			floatingComponents: [EmojiCaretMenu],
		},
	};
};
