import type { TemplateVariablePublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
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
	const [caretMenuOpen, setCaretMenuOpen] = createSignal(
		publicPort.caretMenuOpen,
	);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onOptionsUpdate(setOptions));
	onCleanup(publicPort.onFilteredItemsUpdate(setFilteredItems));
	onCleanup(publicPort.onCaretMenuOpenUpdate(setCaretMenuOpen));

	const port: ReactiveTemplateVariablePort = {
		caretMenuEl: publicPort.caretMenuEl,

		canInsert,
		options,
		filteredItems,
		caretMenuOpen,

		insert: publicPort.insert,
		changeOptions: publicPort.changeOptions,
		select: publicPort.select,
	};

	return port as FromPublicToReactivePort<T>;
};
