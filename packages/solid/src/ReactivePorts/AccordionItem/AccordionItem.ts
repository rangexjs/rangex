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
	const [currentComponent, setCurrentComponent] = createSignal(
		publicPort.currentComponent,
	);

	onCleanup(publicPort.onCanInsertUpdate(setCanInsert));
	onCleanup(publicPort.onCanWrapUpdate(setCanWrap));
	onCleanup(publicPort.onIsActiveUpdate(setIsActive));
	onCleanup(publicPort.onCurrentComponentUpdate(setCurrentComponent));

	const port: ReactiveAccordionItemPort = {
		canInsert,
		canWrap,
		isActive,
		currentComponent,
	};

	return port as PreserveUndefined<T, ReactiveAccordionItemPort>;
};
