import type { LinkPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveLinkPort, ReactiveSelectionMenuPort } from "./Link-types";

export const Link = <T extends LinkPublicPort | undefined>(
	publicPort: T,
): FromPublicToReactivePort<T> => {
	if (!publicPort) {
		return undefined as FromPublicToReactivePort<T>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [linkMenuOpen, setLinkMenuOpen] = createSignal(publicPort.linkMenuOpen);
	const [selectionMenuIsOpen, setSelectionMenuIsOpen] = createSignal(
		publicPort.selectionMenu.isOpen,
	);
	const [currentLink, setCurrentLink] = createSignal(
		publicPort.currentComponent,
	);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(
		publicPort.onLinkMenuToggle(() => setLinkMenuOpen(publicPort.linkMenuOpen)),
	);
	onCleanup(
		publicPort.selectionMenu.onToggle(() =>
			setSelectionMenuIsOpen(publicPort.selectionMenu.isOpen),
		),
	);
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentLink));

	const selectionMenu: ReactiveSelectionMenuPort = {
		element: publicPort.selectionMenu.element,
		isOpen: selectionMenuIsOpen,
		onToggle: publicPort.selectionMenu.onToggle,
		open: publicPort.selectionMenu.open,
		close: publicPort.selectionMenu.close,
		addExemptNode: publicPort.selectionMenu.addExemptNode,
		removeExemptNode: publicPort.selectionMenu.removeExemptNode,
	};

	const port: ReactiveLinkPort = {
		linkMenuEl: publicPort.linkMenuEl,
		selectionMenu,

		canInsert,
		linkMenuOpen,
		currentLink,

		onLinkClick: publicPort.onLinkClick,
		onLinkSelectionIn: publicPort.onLinkSelectionIn,

		insert: publicPort.insert,
		modify: publicPort.modify,
		unwrap: publicPort.unwrap,
		getDisplayText: publicPort.getDisplayText,
	};

	return port as FromPublicToReactivePort<T>;
};
