import type { LinkPublicPort } from "@rangex/editor";
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
	const [currentComponent, setCurrentComponent] = createSignal(
		publicPort.currentComponent,
	);
	const [isSelectionActive, setIsSelectionActive] = createSignal(
		publicPort.isSelectionActive,
	);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentComponent));
	onCleanup(publicPort.onIsSelectionActiveUpdate(setIsSelectionActive));

	const port: ReactiveLinkPort = {
		canInsert,
		currentComponent,
		isSelectionActive,
	};

	return port as PreserveUndefined<T, ReactiveLinkPort>;
};
