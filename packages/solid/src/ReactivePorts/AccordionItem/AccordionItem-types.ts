import type { AccordionItemPublicPort } from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveAccordionItemPort {
	readonly raw: AccordionItemPublicPort;

	canInsert: Accessor<boolean>;
	canWrap: Accessor<boolean>;
	isActive: Accessor<boolean>;

	insert(): void;
	wrap(): void;
	remove(): void;
	unwrap(): void;
}

export interface ReactiveAccordionItemResult {
	port: ReactiveAccordionItemPort;
	dispose: () => void;
}
