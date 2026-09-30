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

	const port: ReactiveAccordionItemPort = {
		canInsert,
		canWrap,
		currentComponent,
		isSelectionActive,
	};

	return port as PreserveUndefined<T, ReactiveAccordionItemPort>;
};
