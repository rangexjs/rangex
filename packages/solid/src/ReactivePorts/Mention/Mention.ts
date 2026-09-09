import type { MentionPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type {
	ReactiveMentionPort,
	ReactiveMentionResult,
} from "./Mention-types";

export const Mention = (
	publicPort: MentionPublicPort,
): ReactiveMentionResult => {
	const [filteredItems, setFilteredItems] = createSignal(
		publicPort.filteredItems,
	);
	const [caretMenuOpen, setCaretMenuOpen] = createSignal(
		publicPort.caretMenuOpen,
	);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onFilteredItemsUpdate(setFilteredItems));
	unsubscribeList.add(publicPort.onCaretMenuOpenUpdate(setCaretMenuOpen));

	const port: ReactiveMentionPort = {
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
