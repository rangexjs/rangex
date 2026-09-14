import type { MentionPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	PreserveUndefined,
	ReactiveCaretMenuPort,
} from "../../_Utilities";
import type { ReactiveMentionPort } from "./Mention-types";

export const Mention = <T extends MentionPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveMentionPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveMentionPort>;
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

	const port: ReactiveMentionPort = {
		caretMenu,

		filteredItems,

		select: publicPort.select,
	};

	return port as PreserveUndefined<T, ReactiveMentionPort>;
};
