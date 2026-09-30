import type { Accessor } from "solid-js";

export interface ReactiveAccordionItemPort {
	canInsert: Accessor<boolean>;
	canWrap: Accessor<boolean>;
	currentComponent: Accessor<HTMLElement | null>;
	isSelectionActive: Accessor<boolean>;
}
