import type { BlockQuotePublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type {
	ReactiveBlockQuotePort,
	ReactiveBlockQuoteResult,
} from "./BlockQuote-types";

export const BlockQuote = (
	publicPort: BlockQuotePublicPort,
): ReactiveBlockQuoteResult => {
	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [canWrap, setCanWrap] = createSignal(publicPort.canWrap);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onCanInsertUpdate(setCanInsert));
	unsubscribeList.add(publicPort.onCanWrapUpdate(setCanWrap));

	const port: ReactiveBlockQuotePort = {
		canInsert,
		canWrap,

		insert: publicPort.insert,
		wrap: publicPort.wrap,
	};

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
