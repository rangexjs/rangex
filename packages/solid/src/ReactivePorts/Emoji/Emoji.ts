import type { EmojiPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type { ReactiveEmojiPort, ReactiveEmojiResult } from "./Emoji-types";

export const Emoji = (publicPort: EmojiPublicPort): ReactiveEmojiResult => {
	const [filteredItems, setFilteredItems] = createSignal(
		publicPort.filteredItems,
	);
	const [caretMenuOpen, setCaretMenuOpen] = createSignal(
		publicPort.caretMenuOpen,
	);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onFilteredItemsUpdate(setFilteredItems));
	unsubscribeList.add(publicPort.onCaretMenuOpenUpdate(setCaretMenuOpen));

	const port: ReactiveEmojiPort = {
		caretMenuEl: publicPort.caretMenuEl,

		filteredItems,
		caretMenuOpen,

		select: publicPort.select,
	};

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
