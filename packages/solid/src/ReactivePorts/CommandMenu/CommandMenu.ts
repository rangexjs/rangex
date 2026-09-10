import type { CommandMenuPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type {
	ReactiveCommandMenuPort,
	ReactiveCommandMenuResult,
} from "./CommandMenu-types";

export const CommandMenu = (
	publicPort: CommandMenuPublicPort,
): ReactiveCommandMenuResult => {
	const [filteredItems, setFilteredItems] = createSignal(
		publicPort.filteredItems,
	);
	const [caretMenuOpen, setCaretMenuOpen] = createSignal(
		publicPort.caretMenuOpen,
	);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onFilteredItemsUpdate(setFilteredItems));
	unsubscribeList.add(publicPort.onCaretMenuOpenUpdate(setCaretMenuOpen));

	const port: ReactiveCommandMenuPort = {
		caretMenuEl: publicPort.caretMenuEl,

		filteredItems,
		caretMenuOpen,

		beforeSelect: publicPort.beforeSelect,
	};

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
