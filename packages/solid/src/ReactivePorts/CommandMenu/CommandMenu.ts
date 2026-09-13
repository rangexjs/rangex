import type { CommandMenuPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveCommandMenuPort } from "./CommandMenu-types";

export const CommandMenu = <T extends CommandMenuPublicPort | undefined>(
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

	const port: ReactiveCommandMenuPort = {
		caretMenuEl: publicPort.caretMenuEl,

		filteredItems,
		caretMenuOpen,

		beforeSelect: publicPort.beforeSelect,
	};

	return port as FromPublicToReactivePort<T>;
};
