import { Emoji as EmojiFactory } from "@rangex/editor/emoji";
import { EmojiCaretMenu } from "#features";
import type { Extension } from "../_Utilities";
import type { EmojiExtensionSettings } from "./Emoji-types";

export const Emoji = (settings: EmojiExtensionSettings): Extension => {
	return {
		createAdapter: () => EmojiFactory(settings),
		components: {
			toolbarButtons: {},
			floatingComponents: [EmojiCaretMenu],
		},
	};
};
