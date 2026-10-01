import type { BlockQuotePublicPort } from "@rangex/editor/block-quote";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveBlockQuotePort } from "./BlockQuote-types";

export const BlockQuote = <T extends BlockQuotePublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveBlockQuotePort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveBlockQuotePort>;
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

	const port: ReactiveBlockQuotePort = {
		canInsert,
		canWrap,
		currentComponent,
		isSelectionActive,
	};

	return port as PreserveUndefined<T, ReactiveBlockQuotePort>;
};
