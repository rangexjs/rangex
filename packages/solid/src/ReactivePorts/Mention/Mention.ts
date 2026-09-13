import type { MentionPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveMentionPort } from "./Mention-types";

export const Mention = <T extends MentionPublicPort | undefined>(
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

	const port: ReactiveMentionPort = {
		caretMenuEl: publicPort.caretMenuEl,

		filteredItems,
		caretMenuOpen,

		select: publicPort.select,
	};

	return port as FromPublicToReactivePort<T>;
};
