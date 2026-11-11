import type { AccordionItemAttrs } from "@rangex/editor/accordion-item";
import type { Accessor } from "solid-js";

export interface ReactiveAccordionItemPort {
	canInsert: Accessor<boolean>;
	canWrap: Accessor<boolean>;
	currentComponent: Accessor<HTMLElement | null>;
	domAttrs: Accessor<AccordionItemAttrs | null>;
	isSelectionActive: Accessor<boolean>;
}
