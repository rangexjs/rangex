import type { AccordionItemPublicPort } from "@rangex/editor/accordion-item";
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
	const [currentComponent, setCurrentComponent] = createSignal(publicPort.currentComponent);
	const [domAttrs, setDOMAttrs] = createSignal(publicPort.domAttrs);
	const [isSelectionActive, setIsSelectionActive] = createSignal(publicPort.isSelectionActive);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCanWrapUpdate(setCanWrap));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentComponent));
	onCleanup(publicPort.onDOMAttrsUpdate(setDOMAttrs));
	onCleanup(publicPort.onIsSelectionActiveUpdate(setIsSelectionActive));

	const port: ReactiveAccordionItemPort = {
		canInsert,
		canWrap,
		currentComponent,
		domAttrs,
		isSelectionActive,
	};

	return port as PreserveUndefined<T, ReactiveAccordionItemPort>;
};
