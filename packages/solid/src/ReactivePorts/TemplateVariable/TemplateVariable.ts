import type { TemplateVariablePublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type {
	FromPublicToReactivePort,
	ReactiveCaretMenuPort,
} from "../../_Utilities";
import type { ReactiveTemplateVariablePort } from "./TemplateVariable-types";

export const TemplateVariable = <
	T extends TemplateVariablePublicPort | undefined,
>(
	publicPort: T,
): FromPublicToReactivePort<T> => {
	if (!publicPort) {
		return undefined as FromPublicToReactivePort<T>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [options, setOptions] = createSignal(publicPort.options);
	const [filteredItems, setFilteredItems] = createSignal(
		publicPort.filteredItems,
	);
	const [caretMenuIsOpen, setCaretMenuIsOpen] = createSignal(
		publicPort.caretMenu.isOpen,
	);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onOptionsUpdate(setOptions));
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

	const port: ReactiveTemplateVariablePort = {
		caretMenu,

		canInsert,
		options,
		filteredItems,

		insert: publicPort.insert,
		changeOptions: publicPort.changeOptions,
		select: publicPort.select,
	};

	return port as FromPublicToReactivePort<T>;
};
