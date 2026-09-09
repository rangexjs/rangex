import type { TemplateVariablePublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type {
	ReactiveTemplateVariablePort,
	ReactiveTemplateVariableResult,
} from "./TemplateVariable-types";

export const TemplateVariable = (
	publicPort: TemplateVariablePublicPort,
): ReactiveTemplateVariableResult => {
	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [options, setOptions] = createSignal(publicPort.options);
	const [filteredItems, setFilteredItems] = createSignal(
		publicPort.filteredItems,
	);
	const [caretMenuOpen, setCaretMenuOpen] = createSignal(
		publicPort.caretMenuOpen,
	);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onCanInsertUpdate(setCanInsert));
	unsubscribeList.add(publicPort.onOptionsUpdate(setOptions));
	unsubscribeList.add(publicPort.onFilteredItemsUpdate(setFilteredItems));
	unsubscribeList.add(publicPort.onCaretMenuOpenUpdate(setCaretMenuOpen));

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

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
