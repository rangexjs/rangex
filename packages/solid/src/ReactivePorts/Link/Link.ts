import type { LinkPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { FromPublicToReactivePort } from "../../_Utilities";
import type { ReactiveLinkPort } from "./Link-types";

export const Link = <T extends LinkPublicPort | undefined>(
	publicPort: T,
): FromPublicToReactivePort<T> => {
	if (!publicPort) {
		return undefined as FromPublicToReactivePort<T>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [linkMenuOpen, setLinkMenuOpen] = createSignal(publicPort.linkMenuOpen);
	const [selectionMenuOpen, setSelectionMenuOpen] = createSignal(
		publicPort.selectionMenuOpen,
	);
	const [currentLink, setCurrentLink] = createSignal(
		publicPort.currentComponent,
	);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(
		publicPort.onLinkMenuToggle(() => setLinkMenuOpen(publicPort.linkMenuOpen)),
	);
	onCleanup(
		publicPort.onSelectionMenuOpenUpdate(() =>
			setSelectionMenuOpen(publicPort.selectionMenuOpen),
		),
	);
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentLink));

	const port: ReactiveLinkPort = {
		linkMenuEl: publicPort.linkMenuEl,
		selectionMenu: publicPort.selectionMenu,

		canInsert,
		linkMenuOpen,
		selectionMenuOpen,
		currentLink,

		onLinkClickEvent: publicPort.onLinkClickEvent,
		onLinkSelectionInEvent: publicPort.onLinkSelectionInEvent,

		insert: publicPort.insert,
		modify: publicPort.modify,
		unwrap: publicPort.unwrap,
		openSelectionMenu: publicPort.openSelectionMenu,
		closeSelectionMenu: publicPort.closeSelectionMenu,
		getDisplayText: publicPort.getDisplayText,
	};

	return port as FromPublicToReactivePort<T>;
};
