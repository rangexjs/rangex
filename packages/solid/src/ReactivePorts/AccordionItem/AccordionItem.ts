import type { AccordionItemPublicPort } from "@rangex/editor";
import { createSignal } from "solid-js";
import type {
	ReactiveAccordionItemPort,
	ReactiveAccordionItemResult,
} from "./AccordionItem-types";

export const AccordionItem = (
	publicPort: AccordionItemPublicPort,
): ReactiveAccordionItemResult => {
	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [canWrap, setCanWrap] = createSignal(publicPort.canWrap);
	const [isActive, setIsActive] = createSignal(publicPort.isActive);

	const unsubscribeList = new Set<() => void>();

	unsubscribeList.add(publicPort.onCanInsertUpdate(setCanInsert));
	unsubscribeList.add(publicPort.onCanWrapUpdate(setCanWrap));
	unsubscribeList.add(publicPort.onIsActiveUpdate(setIsActive));

	const port: ReactiveAccordionItemPort = {
		canInsert,
		canWrap,
		isActive,

		insert: publicPort.insert,
		wrap: publicPort.wrap,
		remove: publicPort.remove,
		unwrap: publicPort.unwrap,
	};

	const dispose = () => {
		for (const unsubscribe of unsubscribeList) {
			unsubscribe();
		}
	};

	return { port, dispose };
};
