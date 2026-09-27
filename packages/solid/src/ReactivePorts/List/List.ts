import type { ListPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveListPort } from "./List-types";

export const List = <T extends ListPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveListPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveListPort>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [canWrap, setCanWrap] = createSignal(publicPort.canWrap);
	const [currentComponent, setCurrentComponent] = createSignal(
		publicPort.currentComponent,
	);
	const [isSelectionActive, setIsSelectionActive] = createSignal(
		publicPort.isSelectionActive,
	);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCanWrapUpdate(setCanWrap));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentComponent));
	onCleanup(publicPort.onIsSelectionActiveUpdate(setIsSelectionActive));

	const port: ReactiveListPort = {
		canInsert,
		canWrap,
		currentComponent,
		isSelectionActive,
	};

	return port as PreserveUndefined<T, ReactiveListPort>;
};
