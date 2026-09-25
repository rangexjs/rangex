import type { EmojiPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveEmojiPort } from "./Emoji-types";

export const Emoji = <T extends EmojiPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveEmojiPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveEmojiPort>;
	}

	const [query, setQuery] = createSignal(publicPort.caretMenu.query);

	onCleanup(publicPort.caretMenu.onQueryUpdate(setQuery));

	const port: ReactiveEmojiPort = {
		query,
		items: publicPort.items,
	};

	return port as PreserveUndefined<T, ReactiveEmojiPort>;
};
