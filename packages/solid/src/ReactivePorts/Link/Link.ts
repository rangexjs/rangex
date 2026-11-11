import type { LinkPublicPort } from "@rangex/editor/link";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveLinkPort } from "./Link-types";

export const Link = <T extends LinkPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveLinkPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveLinkPort>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [domAttrs, setDOMAttrs] = createSignal(publicPort.domAttrs);
	const [currentComponent, setCurrentComponent] = createSignal(
		publicPort.currentComponent,
	);
	const [isSelectionActive, setIsSelectionActive] = createSignal(
		publicPort.isSelectionActive,
	);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onDOMAttrsUpdate(setDOMAttrs));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentComponent));
	onCleanup(publicPort.onIsSelectionActiveUpdate(setIsSelectionActive));

	const port: ReactiveLinkPort = {
		canInsert,
		domAttrs,
		currentComponent,
		isSelectionActive,
	};

	return port as PreserveUndefined<T, ReactiveLinkPort>;
};
