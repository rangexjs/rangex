import type { EmojiPublicPort } from "@rangex/editor/emoji";

import type { PreserveUndefined } from "../../_Utilities";
import { CaretMenu } from "../_Utilities";
import type { ReactiveEmojiPort } from "./Emoji-types";

export const Emoji = <T extends EmojiPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveEmojiPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveEmojiPort>;
	}

	const port: ReactiveEmojiPort = {
		caretMenu: CaretMenu(publicPort.caretMenu),
	};

	return port as PreserveUndefined<T, ReactiveEmojiPort>;
};
