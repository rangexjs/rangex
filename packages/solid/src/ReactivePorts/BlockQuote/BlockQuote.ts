import type { BlockQuotePublicPort } from "@rangex/editor";
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
	const [isActive, setIsActive] = createSignal(publicPort.isActive);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCanWrapUpdate(setCanWrap));
	onCleanup(publicPort.onIsActiveUpdate(setIsActive));

	const port: ReactiveBlockQuotePort = {
		canInsert,
		canWrap,
		isActive,
	};

	return port as PreserveUndefined<T, ReactiveBlockQuotePort>;
};
