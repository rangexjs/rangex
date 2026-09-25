import type { EmojiPublicPort } from "@rangex/editor";
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
		items: publicPort.items,
	};

	return port as PreserveUndefined<T, ReactiveEmojiPort>;
};
