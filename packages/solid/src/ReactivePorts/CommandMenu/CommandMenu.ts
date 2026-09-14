import type { CommandMenuPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromPublicToReactivePort,
	ReactiveCaretMenuPort,
} from "../../_Utilities";
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

	const port: ReactiveCommandMenuPort = {
		caretMenu,

		filteredItems,

		beforeSelect: publicPort.beforeSelect,
	};

	return port as FromPublicToReactivePort<T>;
};
