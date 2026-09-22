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

	const [filteredItems, setFilteredItems] = createSignal(
		publicPort.filteredItems,
	);

	onCleanup(publicPort.onFilteredItemsUpdate(setFilteredItems));

	const port: ReactiveEmojiPort = {
		filteredItems,
	};

	return port as PreserveUndefined<T, ReactiveEmojiPort>;
};
