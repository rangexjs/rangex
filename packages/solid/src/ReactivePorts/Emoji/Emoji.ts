import type { EmojiPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveEmojiPort } from "./Emoji-types";

export const Emoji = <T extends EmojiPublicPort | undefined>(
	publicPort: T,
): FromPublicToReactivePort<T> => {
	if (!publicPort) {
		return undefined as FromPublicToReactivePort<T>;
	}

	const [filteredItems, setFilteredItems] = createSignal(
		publicPort.filteredItems,
	);
	const [caretMenuOpen, setCaretMenuOpen] = createSignal(
		publicPort.caretMenuOpen,
	);

	onCleanup(publicPort.onFilteredItemsUpdate(setFilteredItems));
	onCleanup(publicPort.onCaretMenuOpenUpdate(setCaretMenuOpen));

	const port: ReactiveEmojiPort = {
		caretMenuEl: publicPort.caretMenuEl,

		filteredItems,
		caretMenuOpen,

		select: publicPort.select,
	};

	return port as FromPublicToReactivePort<T>;
};
