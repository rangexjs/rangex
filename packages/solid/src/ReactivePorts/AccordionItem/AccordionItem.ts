import type { AccordionItemPublicPort } from "@rangex/editor";
import { createSignal, onCleanup } from "solid-js";
import type { PreserveUndefined } from "../../_Utilities";
import type { ReactiveAccordionItemPort } from "./AccordionItem-types";

export const AccordionItem = <T extends AccordionItemPublicPort | undefined>(
	publicPort: T,
): PreserveUndefined<T, ReactiveAccordionItemPort> => {
	if (!publicPort) {
		return undefined as PreserveUndefined<T, ReactiveAccordionItemPort>;
	}

	const [canInsert, setCanInsert] = createSignal(publicPort.canInsert);
	const [canWrap, setCanWrap] = createSignal(publicPort.canWrap);
	const [isActive, setIsActive] = createSignal(publicPort.isActive);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCanWrapUpdate(setCanWrap));
	onCleanup(publicPort.onIsActiveUpdate(setIsActive));

	const port: ReactiveAccordionItemPort = {
		canInsert,
		canWrap,
		isActive,

		insert: publicPort.insert,
		wrap: publicPort.wrap,
		remove: publicPort.remove,
		unwrap: publicPort.unwrap,
	};

	return port as PreserveUndefined<T, ReactiveAccordionItemPort>;
};
