import type { LinkPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type { ReactiveLinkPort, ReactiveLinkResult } from "./Link-types";

export const Link = (publicPort: LinkPublicPort): ReactiveLinkResult => {
	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [linkMenuOpen, setLinkMenuOpen] = createSignal(publicPort.linkMenuOpen);
	const [selectionMenuOpen, setSelectionMenuOpen] = createSignal(
		publicPort.selectionMenuOpen,
	);
	const [currentLink, setCurrentLink] = createSignal(
		publicPort.currentComponent,
	);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onCanInsertUpdate(setCanInsert));
	unsubscribeList.add(
		publicPort.onLinkMenuToggle(() => setLinkMenuOpen(publicPort.linkMenuOpen)),
	);
	unsubscribeList.add(
		publicPort.onSelectionMenuOpenUpdate(() =>
			setSelectionMenuOpen(publicPort.selectionMenuOpen),
		),
	);
	unsubscribeList.add(publicPort.onCurrentComponentUpdate(setCurrentLink));

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

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
