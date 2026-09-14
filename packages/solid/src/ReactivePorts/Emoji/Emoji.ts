import type { EmojiPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromPublicToReactivePort,
	ReactiveCaretMenuPort,
} from "../../_Utilities";
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
	const [caretMenuIsOpen, setCaretMenuIsOpen] = createSignal(
		publicPort.caretMenu.isOpen,
	);

	onCleanup(publicPort.onFilteredItemsUpdate(setFilteredItems));
	onCleanup(
		publicPort.caretMenu.onToggle(() =>
			setCaretMenuIsOpen(publicPort.caretMenu.isOpen),
		),
	);

	const caretMenu: ReactiveCaretMenuPort = {
		element: publicPort.caretMenu.element,
		isOpen: caretMenuIsOpen,
	};

	const port: ReactiveEmojiPort = {
		caretMenu,

		filteredItems,

		select: publicPort.select,
	};

	return port as FromPublicToReactivePort<T>;
};
