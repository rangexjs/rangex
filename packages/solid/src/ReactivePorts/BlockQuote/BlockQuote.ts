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

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCanWrapUpdate(setCanWrap));

	const port: ReactiveBlockQuotePort = {
		canInsert,
		canWrap,

		insert: publicPort.insert,
		wrap: publicPort.wrap,
	};

	return port as PreserveUndefined<T, ReactiveBlockQuotePort>;
};
